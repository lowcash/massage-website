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
 * Fixed chrome (WhatsApp, scroll-to-top, section dots) shares one trailing rail. Up to 1439px it is the nav column
 * (max-w-6xl); from 1440px it widens to the content shell plus a 3.5rem outset, so the controls sit in the page
 * gutter and never cover section copy (CONTENT_SHELL is 76rem).
 */
export function FloatingContainer({ children, className, innerClassName }: FloatingContainerProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 pr-[max(1.25rem,env(safe-area-inset-right))] pl-[max(1.25rem,env(safe-area-inset-left))] md:px-8',
        className,
      )}
    >
      <div className={cn('mx-auto flex w-full max-w-6xl min-[1440px]:max-w-[calc(76rem+7rem)]', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
