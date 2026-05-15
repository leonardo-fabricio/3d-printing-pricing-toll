import { useMemo } from 'react'
import type { PieceForm } from '../database/zodSchemas'

export function useCalculation(values: Partial<PieceForm>) {
  return useMemo(() => {
    const filament_price_kg = Number(values.filament_price_kg) || 0
    const grams = Number(values.grams) || 0
    const watts = Number(values.watts) || 0
    const hours = Number(values.hours) || 0
    const kwh_price = Number(values.kwh_price) || 0
    const wear_mode = values.wear_mode ?? 'fixed'
    const wear_value = Number(values.wear_value) || 0
    const packaging = Number(values.packaging) || 0
    const glue_spray = Number(values.glue_spray) || 0
    const finishing = Number(values.finishing) || 0
    const labor = Number(values.labor) || 0
    const other = Number(values.other) || 0
    const profit_percent = Number(values.profit_percent) || 0

    const material = (filament_price_kg / 1000) * grams
    const energy = (watts / 1000) * hours * kwh_price
    const wear = wear_mode === 'fixed'
      ? wear_value * hours
      : (material + energy) * (wear_value / 100)
    const extras = packaging + glue_spray + finishing + labor + other
    const cost_total = material + energy + wear + extras
    const profit_brl = cost_total * (profit_percent / 100)
    const final_price = cost_total + profit_brl

    return { material, energy, wear, extras, cost_total, profit_brl, final_price }
  }, [values.filament_price_kg, values.grams, values.watts, values.hours, values.kwh_price,
      values.wear_mode, values.wear_value, values.packaging, values.glue_spray, values.finishing,
      values.labor, values.other, values.profit_percent])
}
