import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]': variant === 'default',
          'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]': variant === 'secondary',
          'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]': variant === 'success',
          'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]': variant === 'warning',
          'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]': variant === 'destructive',
          'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))]': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
