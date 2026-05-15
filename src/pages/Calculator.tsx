import { useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Copy, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { PieceFormSchema, type PieceForm } from '../database/zodSchemas'
import { insertPiece, updatePiece, getPieceById } from '../services/pieceRepo'
import { useCalculation } from '../hooks/useCalculation'
import { useShortcuts } from '../hooks/useShortcuts'
import { useDraftStore } from '../store/draftStore'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { PieceInfoSection } from '../components/calculator/PieceInfoSection'
import { MaterialSection } from '../components/calculator/MaterialSection'
import { EnergySection } from '../components/calculator/EnergySection'
import { WearSection } from '../components/calculator/WearSection'
import { ExtrasSection } from '../components/calculator/ExtrasSection'
import { ProfitSection } from '../components/calculator/ProfitSection'
import { TotalsCard } from '../components/calculator/TotalsCard'

const DEFAULT_VALUES: PieceForm = {
  name: '', category: '', notes: '',
  filament_type: 'PLA', filament_price_kg: 0, grams: 0,
  printer_id: '', hours: 0, watts: 250, kwh_price: 0.75,
  wear_mode: 'fixed', wear_value: 2,
  packaging: 0, glue_spray: 0, finishing: 0, labor: 0, other: 0,
  profit_percent: 50,
}

export function Calculator() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const editId = params.get('edit')
  const { draft, editingId, setDraft, setEditingId, clearDraft } = useDraftStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<PieceForm>({
    resolver: zodResolver(PieceFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  })

  const values = form.watch()
  const calc = useCalculation(values)

  // Load edit or draft
  useEffect(() => {
    if (editId) {
      getPieceById(editId).then(piece => {
        if (piece) {
          form.reset(piece as unknown as PieceForm)
          setEditingId(editId)
        }
      })
    } else if (draft && !editingId) {
      form.reset({ ...DEFAULT_VALUES, ...draft })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])

  // Auto-save draft
  useEffect(() => {
    const t = setTimeout(() => setDraft(values), 500)
    return () => clearTimeout(t)
  }, [values, setDraft])

  const handleSave = useCallback(async () => {
    const valid = await form.trigger()
    if (!valid) { toast.error('Corrija os campos com erro'); return }
    const data = form.getValues()
    try {
      if (editingId) {
        await updatePiece(editingId, data)
        toast.success('Peça atualizada!')
      } else {
        await insertPiece(data)
        toast.success('Peça salva!')
      }
      clearDraft()
      navigate('/history')
    } catch {
      toast.error('Erro ao salvar')
    }
  }, [form, editingId, navigate, clearDraft])

  const handleDuplicate = useCallback(async () => {
    const data = { ...form.getValues(), name: form.getValues().name + ' (cópia)' }
    try {
      await insertPiece(data)
      toast.success('Duplicado!')
      navigate('/history')
    } catch { toast.error('Erro ao duplicar') }
  }, [form, navigate])

  const handleNew = useCallback(() => {
    form.reset(DEFAULT_VALUES)
    clearDraft()
    navigate('/')
  }, [form, clearDraft, navigate])

  useShortcuts(handleSave, handleDuplicate, handleNew)

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title={editingId ? 'Editar Peça' : 'Nova Calculadora'}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleNew}><RotateCcw size={13} /> Limpar</Button>
            {editingId && <Button variant="ghost" size="sm" onClick={handleDuplicate}><Copy size={13} /> Duplicar</Button>}
            <Button variant="brand" size="sm" onClick={handleSave}><Save size={13} /> Salvar ⌘S</Button>
          </div>
        }
      />
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-5">
          <FormProvider {...form}>
            <form className="space-y-4 max-w-2xl" onSubmit={e => { e.preventDefault(); handleSave() }}>
              <PieceInfoSection />
              <MaterialSection />
              <EnergySection />
              <WearSection />
              <ExtrasSection />
              <ProfitSection />
            </form>
          </FormProvider>
        </div>
        <div className="w-72 p-5 border-l border-border overflow-y-auto">
          <TotalsCard {...calc} profit_percent={Number(values.profit_percent) || 0} />
        </div>
      </div>
    </div>
  )
}
