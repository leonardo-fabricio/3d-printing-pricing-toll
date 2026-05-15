import { useState, useCallback } from 'react'
import { getAllPieces, insertPiece, updatePiece, deletePiece, getPieceById } from '../services/pieceRepo'
import type { Piece, PieceForm } from '../database/zodSchemas'

export function usePieces() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (search = '') => {
    setLoading(true)
    try { setPieces(await getAllPieces(search)) } finally { setLoading(false) }
  }, [])

  const save = useCallback(async (form: PieceForm, id?: string) => {
    if (id) { await updatePiece(id, form) } else { await insertPiece(form) }
    await load()
  }, [load])

  const remove = useCallback(async (id: string) => {
    await deletePiece(id)
    await load()
  }, [load])

  const getById = useCallback((id: string) => getPieceById(id), [])

  return { pieces, loading, load, save, remove, getById }
}
