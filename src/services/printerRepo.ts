import { getDb } from '../database/migrations'
import type { Printer } from '../database/zodSchemas'

export async function getAllPrinters(): Promise<Printer[]> {
  const db = await getDb()
  return db.select<Printer[]>('SELECT * FROM printers ORDER BY name')
}

export async function insertPrinter(p: Omit<Printer, 'id' | 'created_at'>): Promise<Printer> {
  const db = await getDb()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await db.execute(
    'INSERT INTO printers (id,name,watts,wear_mode,wear_value,kwh_price,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [id, p.name, p.watts, p.wear_mode, p.wear_value, p.kwh_price, now]
  )
  return { id, created_at: now, ...p }
}

export async function updatePrinter(id: string, p: Omit<Printer, 'id' | 'created_at'>): Promise<void> {
  const db = await getDb()
  await db.execute(
    'UPDATE printers SET name=$1,watts=$2,wear_mode=$3,wear_value=$4,kwh_price=$5 WHERE id=$6',
    [p.name, p.watts, p.wear_mode, p.wear_value, p.kwh_price, id]
  )
}

export async function deletePrinter(id: string): Promise<void> {
  const db = await getDb()
  await db.execute('DELETE FROM printers WHERE id=$1', [id])
}
