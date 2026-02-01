'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({ className, src, alt = '', fallback, size = 'md', ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
  }

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-[hsl(var(--muted))] ring-2 ring-[hsl(var(--primary))]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center font-semibold text-[hsl(var(--primary))]',
            fontSizeClasses[size]
          )}
        >
          {fallback?.charAt(0).toUpperCase() || '?'}
        </span>
      )}
    </div>
  )
}
