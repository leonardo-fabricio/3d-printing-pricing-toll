import { useState, useCallback } from 'react'
import { getAllPrinters, insertPrinter, updatePrinter, deletePrinter } from '../services/printerRepo'
import type { Printer } from '../database/zodSchemas'

export function usePrinters() {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setPrinters(await getAllPrinters()) } finally { setLoading(false) }
  }, [])

  const save = useCallback(async (data: Omit<Printer, 'id' | 'created_at'>, id?: string) => {
    if (id) { await updatePrinter(id, data) } else { await insertPrinter(data) }
    await load()
  }, [load])

  const remove = useCallback(async (id: string) => {
    await deletePrinter(id)
    await load()
  }, [load])

  return { printers, loading, load, save, remove }
}
