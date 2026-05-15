import { getDb } from '../database/migrations'
import type { Piece, PieceForm } from '../database/zodSchemas'

function calcTotals(f: PieceForm) {
  const material = (f.filament_price_kg / 1000) * f.grams
  const energy = (f.watts / 1000) * f.hours * f.kwh_price
  const wear = f.wear_mode === 'fixed'
    ? f.wear_value * f.hours
    : (material + energy) * (f.wear_value / 100)
  const extras = (f.packaging ?? 0) + (f.glue_spray ?? 0) + (f.finishing ?? 0) + (f.labor ?? 0) + (f.other ?? 0)
  const cost_total = material + energy + wear + extras
  const final_price = cost_total * (1 + f.profit_percent / 100)
  return { cost_total, final_price }
}

export async function insertPiece(form: PieceForm): Promise<Piece> {
  const db = await getDb()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const { cost_total, final_price } = calcTotals(form)
  await db.execute(
    `INSERT INTO pieces (id,name,category,notes,filament_type,filament_price_kg,grams,printer_id,hours,watts,kwh_price,wear_mode,wear_value,packaging,glue_spray,finishing,labor,other,profit_percent,cost_total,final_price,created_at,updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
    [id, form.name, form.category ?? null, form.notes ?? null, form.filament_type ?? null,
     form.filament_price_kg, form.grams, form.printer_id ?? null, form.hours, form.watts,
     form.kwh_price, form.wear_mode, form.wear_value, form.packaging ?? 0, form.glue_spray ?? 0,
     form.finishing ?? 0, form.labor ?? 0, form.other ?? 0, form.profit_percent,
     cost_total, final_price, now, now]
  )
  return { id, ...form, cost_total, final_price, created_at: now, updated_at: now }
}

export async function updatePiece(id: string, form: PieceForm): Promise<void> {
  const db = await getDb()
  const now = new Date().toISOString()
  const { cost_total, final_price } = calcTotals(form)
  await db.execute(
    `UPDATE pieces SET name=$1,category=$2,notes=$3,filament_type=$4,filament_price_kg=$5,grams=$6,printer_id=$7,hours=$8,watts=$9,kwh_price=$10,wear_mode=$11,wear_value=$12,packaging=$13,glue_spray=$14,finishing=$15,labor=$16,other=$17,profit_percent=$18,cost_total=$19,final_price=$20,updated_at=$21 WHERE id=$22`,
    [form.name, form.category ?? null, form.notes ?? null, form.filament_type ?? null,
     form.filament_price_kg, form.grams, form.printer_id ?? null, form.hours, form.watts,
     form.kwh_price, form.wear_mode, form.wear_value, form.packaging ?? 0, form.glue_spray ?? 0,
     form.finishing ?? 0, form.labor ?? 0, form.other ?? 0, form.profit_percent,
     cost_total, final_price, now, id]
  )
}

export async function deletePiece(id: string): Promise<void> {
  const db = await getDb()
  await db.execute('DELETE FROM pieces WHERE id=$1', [id])
}

export async function getAllPieces(search = ''): Promise<Piece[]> {
  const db = await getDb()
  const rows = await db.select<Piece[]>(
    search
      ? `SELECT * FROM pieces WHERE name LIKE $1 ORDER BY created_at DESC`
      : `SELECT * FROM pieces ORDER BY created_at DESC`,
    search ? [`%${search}%`] : []
  )
  return rows
}

export async function getPieceById(id: string): Promise<Piece | null> {
  const db = await getDb()
  const rows = await db.select<Piece[]>('SELECT * FROM pieces WHERE id=$1', [id])
  return rows[0] ?? null
}

export async function getDashboardStats() {
  const db = await getDb()
  const [stats] = await db.select<{ count: number; avg_profit: number; avg_price: number; total_revenue: number }[]>(
    `SELECT COUNT(*) as count, AVG(profit_percent) as avg_profit, AVG(final_price) as avg_price, SUM(final_price) as total_revenue FROM pieces`
  )
  const recent = await db.select<Piece[]>('SELECT * FROM pieces ORDER BY created_at DESC LIMIT 5')
  return { stats, recent }
}
