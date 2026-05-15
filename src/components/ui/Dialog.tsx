import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-bg-elevated border border-border rounded-2xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-fg">{title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}><X size={16} /></Button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description?: string
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      {description && <p className="text-sm text-fg-muted mb-6">{description}</p>}
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="destructive" onClick={() => { onConfirm(); onClose() }}>Excluir</Button>
      </div>
    </Dialog>
  )
}
