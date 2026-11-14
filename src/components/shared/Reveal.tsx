'use client'

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { useInView } from '@/src/hooks/useInView'
import { usePrefersReducedMotion } from '@/src/hooks/usePrefersReducedMotion'

const FADE_IN = 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'

type RevealProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delayMs?: number
  as?: 'div' | 'section' | 'article' | 'aside' | 'li'
}

/**
 * In-view fade/translate. SSR HTML stays visible (no opacity-0) so no-JS and
 * crawlers see content. After mount, off-screen nodes may hide then reveal.
 */
export function Reveal({ children, className, style, delayMs = 0, as: Tag = 'div' }: RevealProps) {
  const shouldReduceMotion = usePrefersReducedMotion()
  const { ref, inView } = useInView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hideUntilView = mounted && !shouldReduceMotion && !inView

  return (
    <Tag
      ref={ref as never}
      className={cn(FADE_IN, hideUntilView && 'translate-y-4 opacity-0', className)}
      style={{
        ...style,
        transitionDelay: inView && delayMs > 0 ? `${delayMs}ms` : '0ms',
      }}
    >
      {children}
    </Tag>
  )
}
