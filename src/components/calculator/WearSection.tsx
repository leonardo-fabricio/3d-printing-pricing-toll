import { useFormContext } from 'react-hook-form'
import { Wrench } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import type { PieceForm } from '../../database/zodSchemas'

export function WearSection() {
  const { register, watch, setValue } = useFormContext<PieceForm>()
  const mode = watch('wear_mode')

  return (
    <Card>
      <CardHeader>
        <CardTitle><Wrench size={14} className="text-brand-400" /> Desgaste da Impressora</CardTitle>
      </CardHeader>
      <div className="flex gap-2 mb-3">
        {(['fixed', 'percent'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setValue('wear_mode', m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-fg-muted hover:text-fg border border-transparent'}`}
          >
            {m === 'fixed' ? 'Custo fixo/hora' : '% sobre custos'}
          </button>
        ))}
      </div>
      <Input
        label={mode === 'fixed' ? 'Custo por hora' : 'Percentual de desgaste'}
        prefix={mode === 'fixed' ? 'R$' : undefined}
        suffix={mode === 'percent' ? '%' : undefined}
        type="number"
        step={mode === 'fixed' ? '0.01' : '0.1'}
        placeholder={mode === 'fixed' ? '2.00' : '5'}
        {...register('wear_value')}
      />
    </Card>
  )
}
