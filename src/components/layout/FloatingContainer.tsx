import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface FloatingContainerProps {
  children: ReactNode
  /** Vertical placement and stacking, e.g. "bottom-6 z-40". */
  className?: string
  /** Alignment of the children inside the container, e.g. "justify-end". */
  innerClassName?: string
  /**
   * "content": same width as the page content (it only widens on screens of 1380px and more, where there is room
   * beside the content). "edge": always one step wider than the content, for elements that must stay clear of it.
   */
  variant?: 'content' | 'edge'
}

/**
 * Fixed-position elements (WhatsApp, scroll to top, section dots) are laid out inside the same centered column as
 * the page, so on very wide screens they stay near the content instead of sticking to the far window edge.
 */
export function FloatingContainer({
  children,
  className,
  innerClassName,
  variant = 'content',
}: FloatingContainerProps) {
  return (
    <div className={cn('pointer-events-none fixed inset-x-0 px-5 min-[1380px]:px-6 md:px-8', className)}>
      <div
        className={cn(
          'mx-auto flex w-full',
          variant === 'edge' ? 'max-w-[84rem]' : 'max-w-6xl min-[1380px]:max-w-[84rem]',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
