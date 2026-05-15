import Database from '@tauri-apps/plugin-sql'

const SCHEMA = `
CREATE TABLE IF NOT EXISTS printers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  watts REAL NOT NULL,
  wear_mode TEXT NOT NULL,
  wear_value REAL NOT NULL,
  kwh_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pieces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  filament_type TEXT,
  filament_price_kg REAL NOT NULL,
  grams REAL NOT NULL,
  printer_id TEXT,
  hours REAL NOT NULL,
  watts REAL NOT NULL,
  kwh_price REAL NOT NULL,
  wear_mode TEXT NOT NULL,
  wear_value REAL NOT NULL,
  packaging REAL DEFAULT 0,
  glue_spray REAL DEFAULT 0,
  finishing REAL DEFAULT 0,
  labor REAL DEFAULT 0,
  other REAL DEFAULT 0,
  profit_percent REAL NOT NULL,
  cost_total REAL NOT NULL,
  final_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pieces_name ON pieces(name);
CREATE INDEX IF NOT EXISTS idx_pieces_created_at ON pieces(created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`

let db: Database | null = null
let initPromise: Promise<Database> | null = null

async function init(): Promise<Database> {
  const instance = await Database.load('sqlite:pricing.db')
  const stmts = SCHEMA.split(';').map(s => s.trim()).filter(Boolean)
  for (const stmt of stmts) {
    await instance.execute(stmt, [])
  }
  return instance
}

export async function getDb(): Promise<Database> {
  if (db) return db
  if (!initPromise) {
    initPromise = init().then(instance => {
      db = instance
      return instance
    }).catch(e => {
      initPromise = null
      console.error('[DB] Falha ao inicializar:', e)
      throw e
    })
  }
  return initPromise
}
