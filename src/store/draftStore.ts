import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PieceForm } from '../database/zodSchemas'

interface DraftStore {
  draft: Partial<PieceForm> | null
  editingId: string | null
  setDraft: (d: Partial<PieceForm>) => void
  setEditingId: (id: string | null) => void
  clearDraft: () => void
}
export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      draft: null,
      editingId: null,
      setDraft: (draft) => set({ draft }),
      setEditingId: (editingId) => set({ editingId }),
      clearDraft: () => set({ draft: null, editingId: null }),
    }),
    { name: 'draft-store' }
  )
)
