import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-xs font-medium text-fg-muted">{label}</label>}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-bg-subtle border border-border rounded-xl px-3 py-2 text-sm text-fg',
            'focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200',
            'appearance-none cursor-pointer',
            error && 'border-red-600',
            className
          )}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
