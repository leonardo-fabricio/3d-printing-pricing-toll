import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Edit, Copy, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { getAllPieces, deletePiece, insertPiece, getPieceById } from '../services/pieceRepo'
import type { Piece } from '../database/zodSchemas'
import { formatBRL } from '../services/formatters'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/Dialog'
import { useDraftStore } from '../store/draftStore'

export function History() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)
  const { setEditingId } = useDraftStore()

  const load = useCallback(async (q = '') => {
    setPieces(await getAllPieces(q))
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setTimeout(() => load(search), 300); return () => clearTimeout(t) }, [search, load])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleEdit = (p: Piece) => {
    setEditingId(p.id)
    navigate(`/?edit=${p.id}`)
  }

  const handleDuplicate = async (id: string) => {
    const piece = await getPieceById(id)
    if (!piece) return
    const { id: _id, created_at: _ca, updated_at: _ua, cost_total: _ct, final_price: _fp, ...form } = piece
    await insertPiece({ ...form, name: form.name + ' (cópia)' })
    toast.success('Duplicado!')
    load(search)
  }

  const handleDelete = async (id: string) => {
    await deletePiece(id)
    toast.success('Excluído')
    load(search)
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Histórico" />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome… ⌘K"
            className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>

        {pieces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mb-4">
              <Package size={28} className="text-fg-subtle" />
            </div>
            <p className="text-sm font-medium text-fg-muted">Nenhuma peça encontrada</p>
            <p className="text-xs text-fg-subtle mt-1">Crie seu primeiro orçamento na Calculadora</p>
          </div>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-subtle border-b border-border">
                  {['Nome', 'Categoria', 'Custo Total', 'Preço Final', 'Lucro %', 'Data', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-fg-subtle">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pieces.map((p, i) => (
                  <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-bg-elevated transition-colors ${i % 2 === 0 ? '' : 'bg-bg-subtle/30'}`}>
                    <td className="px-4 py-3 text-sm font-medium text-fg max-w-[180px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-fg-muted">{p.category || '—'}</td>
                    <td className="px-4 py-3 text-sm text-fg tabular-nums">{formatBRL(p.cost_total)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-400 tabular-nums">{formatBRL(p.final_price)}</td>
                    <td className="px-4 py-3 text-sm text-green-400 tabular-nums">{p.profit_percent.toFixed(0)}%</td>
                    <td className="px-4 py-3 text-xs text-fg-subtle">{new Date(p.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Edit size={13} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(p.id)}><Copy size={13} /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => setDeleteTarget(p.id)}><Trash2 size={13} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Excluir peça"
        description="Esta ação não pode ser desfeita."
      />
    </div>
  )
}
