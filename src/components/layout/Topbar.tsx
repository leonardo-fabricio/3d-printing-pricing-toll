import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { useUiStore } from '../../store/uiStore'

interface TopbarProps { title: string; actions?: React.ReactNode }

export function Topbar({ title, actions }: TopbarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  return (
    <header className="h-12 border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-fg-subtle">
        {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      </Button>
      <h1 className="text-sm font-semibold text-fg flex-1">{title}</h1>
      {actions}
    </header>
  )
}
