import { useFormContext } from 'react-hook-form'
import { Package } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import type { PieceForm } from '../../database/zodSchemas'

const FILAMENTS = [
  { value: 'PLA', label: 'PLA' }, { value: 'PETG', label: 'PETG' },
  { value: 'ABS', label: 'ABS' }, { value: 'TPU', label: 'TPU' },
  { value: 'ASA', label: 'ASA' }, { value: 'Nylon', label: 'Nylon' },
  { value: 'Resin', label: 'Resina' }, { value: 'outro', label: 'Outro' },
]

export function MaterialSection() {
  const { register, formState: { errors } } = useFormContext<PieceForm>()
  return (
    <Card>
      <CardHeader>
        <CardTitle><Package size={14} className="text-brand-400" /> Custos de Material</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-fg-muted block mb-1.5">Tipo de Filamento</label>
          <select className="w-full bg-bg-subtle border border-border rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-brand-500 transition-all" {...register('filament_type')}>
            {FILAMENTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <Input label="Preço por kg *" prefix="R$" type="number" step="0.01" placeholder="89.90" error={errors.filament_price_kg?.message} {...register('filament_price_kg')} />
        <Input label="Quantidade *" suffix="g" type="number" step="0.1" placeholder="45" error={errors.grams?.message} {...register('grams')} />
      </div>
    </Card>
  )
}
