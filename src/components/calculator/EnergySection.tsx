import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { getAllPrinters } from '../../services/printerRepo'
import type { Printer } from '../../database/zodSchemas'
import type { PieceForm } from '../../database/zodSchemas'

export function EnergySection() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<PieceForm>()
  const [printers, setPrinters] = useState<Printer[]>([])
  const selectedPrinterId = watch('printer_id')

  useEffect(() => {
    getAllPrinters().then(setPrinters).catch(console.error)
  }, [])

  function handlePrinterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setValue('printer_id', id)
    const printer = printers.find(p => p.id === id)
    if (printer) {
      setValue('watts', printer.watts)
      setValue('kwh_price', printer.kwh_price)
      setValue('wear_mode', printer.wear_mode)
      setValue('wear_value', printer.wear_value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle><Zap size={14} className="text-brand-400" /> Energia Elétrica</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3">
          <label className="text-xs font-medium text-fg-muted block mb-1.5">
            Impressora
            {printers.length === 0 && (
              <span className="ml-2 text-fg-subtle font-normal">— cadastre impressoras em Configurações</span>
            )}
          </label>
          <select
            value={selectedPrinterId ?? ''}
            onChange={handlePrinterChange}
            className="w-full bg-bg-subtle border border-border rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-brand-500 transition-all"
          >
            <option value="">Selecionar impressora (opcional)</option>
            {printers.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.watts}W</option>
            ))}
          </select>
        </div>
        <Input
          label="Tempo de impressão *"
          suffix="h"
          type="number"
          step="0.1"
          placeholder="4.5"
          error={errors.hours?.message}
          {...register('hours')}
        />
        <Input
          label="Consumo da impressora *"
          suffix="W"
          type="number"
          step="1"
          placeholder="250"
          error={errors.watts?.message}
          {...register('watts')}
        />
        <Input
          label="Valor do kWh *"
          prefix="R$"
          type="number"
          step="0.001"
          placeholder="0.75"
          error={errors.kwh_price?.message}
          {...register('kwh_price')}
        />
      </div>
    </Card>
  )
}
