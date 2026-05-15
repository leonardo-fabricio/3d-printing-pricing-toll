import { useFormContext } from 'react-hook-form'
import { Tag } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import type { PieceForm } from '../../database/zodSchemas'

const CATEGORIES = [
  { value: '', label: 'Sem categoria' },
  { value: 'decoração', label: 'Decoração' },
  { value: 'protótipo', label: 'Protótipo' },
  { value: 'funcional', label: 'Peça Funcional' },
  { value: 'miniatura', label: 'Miniatura' },
  { value: 'joia', label: 'Joia/Bijuteria' },
  { value: 'outro', label: 'Outro' },
]

export function PieceInfoSection() {
  const { register, formState: { errors } } = useFormContext<PieceForm>()
  return (
    <Card>
      <CardHeader>
        <CardTitle><Tag size={14} className="text-brand-400" /> Informações da Peça</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Input label="Nome da peça *" placeholder="Ex: Suporte para câmera" error={errors.name?.message} {...register('name')} />
        </div>
        <Select label="Categoria" options={CATEGORIES} {...register('category')} />
        <div />
        <div className="col-span-2">
          <Textarea label="Observações" placeholder="Notas opcionais..." {...register('notes')} />
        </div>
      </div>
    </Card>
  )
}
