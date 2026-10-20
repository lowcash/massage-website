'use client'

import { cn } from '@/lib/utils'

import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

interface DrawnLineProps {
  className?: string
  light?: boolean
}

/** A small hand-drawn wave that draws itself once when it scrolls into view. */
export function DrawnLine({ className, light = false }: DrawnLineProps) {
  const { ref, inView } = useInView()
  const shouldReduceMotion = useReducedMotion()
  const isDrawn = inView || shouldReduceMotion

  return (
    <div ref={ref} aria-hidden='true' className={cn('h-4 w-44', className)}>
      <svg viewBox='0 0 180 16' fill='none' className='h-full w-full overflow-visible'>
        <path
          d='M2 9 C 26 2, 52 15, 90 8 S 156 2, 178 8'
          pathLength={1}
          strokeWidth={1.6}
          strokeLinecap='round'
          className={light ? 'stroke-white/70' : 'stroke-brand/70'}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isDrawn ? 0 : 1,
            transition: shouldReduceMotion ? 'none' : 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.25s',
          }}
        />
      </svg>
    </div>
  )
}
