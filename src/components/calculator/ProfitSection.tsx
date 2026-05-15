import { useFormContext } from 'react-hook-form'
import { TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import type { PieceForm } from '../../database/zodSchemas'

const SUGGESTIONS = [
  { label: 'Simples', value: 30, color: 'text-green-400 border-green-800/40 bg-green-900/10' },
  { label: 'Média', value: 50, color: 'text-yellow-400 border-yellow-800/40 bg-yellow-900/10' },
  { label: 'Complexa', value: 80, color: 'text-brand-400 border-brand-500/30 bg-brand-500/10' },
]

export function ProfitSection() {
  const { register, setValue } = useFormContext<PieceForm>()
  return (
    <Card>
      <CardHeader>
        <CardTitle><TrendingUp size={14} className="text-brand-400" /> Margem de Lucro</CardTitle>
      </CardHeader>
      <div className="flex gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => setValue('profit_percent', s.value, { shouldValidate: true })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:opacity-80 ${s.color}`}
          >
            {s.label} {s.value}%
          </button>
        ))}
      </div>
      <Input label="Percentual de lucro" suffix="%" type="number" step="1" placeholder="50" {...register('profit_percent')} />
    </Card>
  )
}
