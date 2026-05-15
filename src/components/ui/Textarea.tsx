import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-xs font-medium text-fg-muted">{label}</label>}
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={cn(
            'w-full bg-bg-subtle border border-border rounded-xl px-3 py-2 text-sm text-fg placeholder:text-fg-subtle resize-none',
            'focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200',
            error && 'border-red-600',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
