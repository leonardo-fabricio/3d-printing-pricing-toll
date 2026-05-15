import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'brand'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-bg-elevated border border-border text-fg hover:border-border-strong hover:bg-bg-subtle': variant === 'default',
            'text-fg-muted hover:text-fg hover:bg-bg-elevated': variant === 'ghost',
            'border border-border text-fg-muted hover:text-fg hover:border-border-strong': variant === 'outline',
            'bg-red-900/20 border border-red-800/40 text-red-400 hover:bg-red-900/30': variant === 'destructive',
            'bg-brand-500 text-white hover:bg-brand-400': variant === 'brand',
          },
          {
            'px-2.5 py-1.5 text-xs': size === 'sm',
            'px-3.5 py-2 text-sm': size === 'md',
            'px-5 py-2.5 text-sm': size === 'lg',
            'p-2': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
