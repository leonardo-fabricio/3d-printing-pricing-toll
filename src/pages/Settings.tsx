import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Edit, Trash2, Printer as PrinterIcon, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { PrinterSchema, type Printer } from '../database/zodSchemas'
import { getAllPrinters, insertPrinter, updatePrinter, deletePrinter } from '../services/printerRepo'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/Dialog'

const PrinterFormSchema = PrinterSchema.omit({ id: true, created_at: true })
type PrinterForm = z.infer<typeof PrinterFormSchema>

function PrinterFormRow({ onSave, onCancel, initial }: { onSave: (d: PrinterForm) => void; onCancel: () => void; initial?: Printer }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<PrinterForm>({
    resolver: zodResolver(PrinterFormSchema) as any,
    defaultValues: initial ?? { name: '', watts: 250, wear_mode: 'fixed', wear_value: 2, kwh_price: 0.75 },
  })
  return (
    <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-5 gap-2 items-end p-3 bg-bg-subtle rounded-xl border border-brand-500/20">
      <Input label="Nome" placeholder="Ender 3" error={errors.name?.message} {...register('name')} />
      <Input label="Watts" suffix="W" type="number" {...register('watts')} />
      <div>
        <label className="text-xs font-medium text-fg-muted block mb-1.5">Modo desgaste</label>
        <select className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-brand-500" {...register('wear_mode')}>
          <option value="fixed">Fixo R$/h</option>
          <option value="percent">% custos</option>
        </select>
      </div>
      <Input label="Desgaste" type="number" step="0.01" {...register('wear_value')} />
      <Input label="kWh (R$)" prefix="R$" type="number" step="0.001" {...register('kwh_price')} />
      <div className="col-span-5 flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}><X size={13} /> Cancelar</Button>
        <Button type="submit" variant="brand" size="sm"><Check size={13} /> Salvar</Button>
      </div>
    </form>
  )
}

export function Settings() {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = () => getAllPrinters().then(setPrinters).catch(e => console.error('[Settings] Erro ao carregar impressoras:', e))
  useEffect(() => { load() }, [])

  const handleSave = async (data: PrinterForm, id?: string) => {
    try {
      if (id) { await updatePrinter(id, data) } else { await insertPrinter(data) }
      toast.success(id ? 'Impressora atualizada!' : 'Impressora cadastrada!')
      setAdding(false); setEditId(null)
      load()
    } catch (e) { console.error('[Settings] Erro ao salvar:', e); toast.error('Erro ao salvar: ' + String(e)) }
  }

  const handleDelete = async (id: string) => {
    await deletePrinter(id)
    toast.success('Impressora removida')
    load()
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Configurações" actions={
        <Button variant="brand" size="sm" onClick={() => setAdding(true)}><Plus size={13} /> Nova Impressora</Button>
      } />
      <div className="flex-1 overflow-y-auto p-5 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle><PrinterIcon size={14} className="text-brand-400" /> Perfis de Impressora</CardTitle>
          </CardHeader>

          {adding && <div className="mb-3"><PrinterFormRow onSave={d => handleSave(d)} onCancel={() => setAdding(false)} /></div>}

          {printers.length === 0 && !adding ? (
            <p className="text-sm text-fg-subtle text-center py-8">Nenhuma impressora cadastrada. Clique em "Nova Impressora" para começar.</p>
          ) : (
            <div className="space-y-2">
              {printers.map(p => (
                editId === p.id ? (
                  <PrinterFormRow key={p.id} initial={p} onSave={d => handleSave(d, p.id)} onCancel={() => setEditId(null)} />
                ) : (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-fg">{p.name}</p>
                      <p className="text-xs text-fg-subtle">
                        {p.watts}W · {p.wear_mode === 'fixed' ? `R$${p.wear_value}/h` : `${p.wear_value}%`} · kWh R${p.kwh_price}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditId(p.id)}><Edit size={13} /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteTarget(p.id)}><Trash2 size={13} /></Button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Remover impressora"
        description="As peças já salvas com esta impressora não serão afetadas."
      />
    </div>
  )
}
