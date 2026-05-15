import { z } from 'zod'

export const PrinterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  watts: z.coerce.number().positive('Deve ser positivo'),
  wear_mode: z.enum(['fixed', 'percent']),
  wear_value: z.coerce.number().min(0),
  kwh_price: z.coerce.number().positive(),
  created_at: z.string().optional(),
})
export type Printer = z.infer<typeof PrinterSchema>

export const PieceFormSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  category: z.string().optional(),
  notes: z.string().optional(),
  filament_type: z.string().optional(),
  filament_price_kg: z.coerce.number().min(0),
  grams: z.coerce.number().min(0),
  printer_id: z.string().optional(),
  hours: z.coerce.number().min(0),
  watts: z.coerce.number().min(0),
  kwh_price: z.coerce.number().min(0),
  wear_mode: z.enum(['fixed', 'percent']),
  wear_value: z.coerce.number().min(0),
  packaging: z.coerce.number().min(0).default(0),
  glue_spray: z.coerce.number().min(0).default(0),
  finishing: z.coerce.number().min(0).default(0),
  labor: z.coerce.number().min(0).default(0),
  other: z.coerce.number().min(0).default(0),
  profit_percent: z.coerce.number().min(0).max(10000),
})
export type PieceForm = z.infer<typeof PieceFormSchema>

export const PieceSchema = PieceFormSchema.extend({
  id: z.string(),
  cost_total: z.number(),
  final_price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Piece = z.infer<typeof PieceSchema>
