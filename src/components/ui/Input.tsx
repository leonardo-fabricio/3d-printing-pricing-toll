import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, suffix, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-xs font-medium text-fg-muted">{label}</label>}
        <div className="relative flex items-center">
          {prefix && <span className="absolute left-3 text-fg-subtle text-sm">{prefix}</span>}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-bg-subtle border border-border rounded-xl px-3 py-2 text-sm text-fg placeholder:text-fg-subtle',
              'focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200',
              prefix && 'pl-7',
              suffix && 'pr-7',
              error && 'border-red-600',
              className
            )}
            {...props}
          />
          {suffix && <span className="absolute right-3 text-fg-subtle text-sm">{suffix}</span>}
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
