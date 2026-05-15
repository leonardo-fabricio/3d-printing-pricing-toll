import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useShortcuts(
  onSave?: () => void,
  onDuplicate?: () => void,
  onNew?: () => void,
) {
  const navigate = useNavigate()
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 's') { e.preventDefault(); onSave?.() }
      if (e.key === 'd') { e.preventDefault(); onDuplicate?.() }
      if (e.key === 'n') { e.preventDefault(); onNew?.() }
      if (e.key === '1') { e.preventDefault(); navigate('/') }
      if (e.key === '2') { e.preventDefault(); navigate('/history') }
      if (e.key === '3') { e.preventDefault(); navigate('/dashboard') }
      if (e.key === '4') { e.preventDefault(); navigate('/settings') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, onSave, onDuplicate, onNew])
}
