import { NavLink } from 'react-router-dom'
import { Calculator, History, LayoutDashboard, Settings, Printer } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useUiStore } from '../../store/uiStore'

const nav = [
  { to: '/', icon: Calculator, label: 'Calculadora', shortcut: '⌘1' },
  { to: '/history', icon: History, label: 'Histórico', shortcut: '⌘2' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘3' },
  { to: '/settings', icon: Settings, label: 'Configurações', shortcut: '⌘4' },
]

export function Sidebar() {
  const { sidebarCollapsed } = useUiStore()

  return (
    <aside className={cn(
      'h-screen bg-bg-subtle border-r border-border flex flex-col transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-56'
    )}>
      <div className={cn('flex items-center gap-2.5 px-4 py-5 border-b border-border', sidebarCollapsed && 'justify-center px-0')}>
        <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Printer size={14} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-xs font-semibold text-fg leading-tight">3D Pricer</p>
            <p className="text-[10px] text-fg-subtle">Precificação</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-0.5">
        {nav.map(({ to, icon: Icon, label, shortcut }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
              isActive
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                : 'text-fg-muted hover:text-fg hover:bg-bg-elevated',
              sidebarCollapsed && 'justify-center px-0'
            )}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">{label}</span>
                <span className="text-[10px] text-fg-subtle">{shortcut}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2">
        <p className={cn('text-[10px] text-fg-subtle px-3 py-1', sidebarCollapsed && 'hidden')}>
          3D Pricer v1.0.0
        </p>
      </div>
    </aside>
  )
}
