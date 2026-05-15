import { useFormContext } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import type { PieceForm } from '../../database/zodSchemas'

const extras = [
  { field: 'packaging' as const, label: 'Embalagem' },
  { field: 'glue_spray' as const, label: 'Cola/Spray' },
  { field: 'finishing' as const, label: 'Acabamento' },
  { field: 'labor' as const, label: 'Mão de obra' },
  { field: 'other' as const, label: 'Outros' },
]

export function ExtrasSection() {
  const { register } = useFormContext<PieceForm>()
  return (
    <Card>
      <CardHeader>
        <CardTitle><Plus size={14} className="text-brand-400" /> Custos Extras</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {extras.map(e => (
          <Input key={e.field} label={e.label} prefix="R$" type="number" step="0.01" placeholder="0" {...register(e.field)} />
        ))}
      </div>
    </Card>
  )
}
