import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface FloatingContainerProps {
  children: ReactNode
  /** Vertical placement and stacking, e.g. "bottom-6 z-40". */
  className?: string
  /** Alignment of the children inside the container, e.g. "justify-end". */
  innerClassName?: string
}

/**
 * Fixed chrome (WhatsApp, scroll-to-top, section dots) uses the same centered column and
 * horizontal padding as the header nav and footer (max-w-6xl). Section bodies use
 * CONTENT_SHELL (extra px-6) so copy clears these controls without shifting the chrome rail.
 */
export function FloatingContainer({ children, className, innerClassName }: FloatingContainerProps) {
  return (
    <div className={cn('pointer-events-none fixed inset-x-0 px-5 md:px-8', className)}>
      <div className={cn('mx-auto flex w-full max-w-6xl', innerClassName)}>{children}</div>
    </div>
  )
}
