import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  soft?: boolean
  as?: 'div' | 'section' | 'article' | 'aside' | 'li'
}

/**
 * Scroll reveal marker. Pure CSS (see `.reveal` in globals.css): visible by default,
 * animated by a view timeline only where supported and motion is allowed.
 */
export function Reveal({ children, className, style, soft = false, as: Tag = 'div' }: RevealProps) {
  return (
    <Tag className={cn(soft ? 'reveal-soft' : 'reveal', className)} style={style}>
      {children}
    </Tag>
  )
}
