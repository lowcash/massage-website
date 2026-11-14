'use client'

import { useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/src/hooks/usePrefersReducedMotion'

interface CountUpValueProps {
  value: number
  suffix?: string
  durationMs?: number
}

export default function CountUpValue({ value, suffix = '', durationMs = 1200 }: CountUpValueProps) {
  // `null` = show the final value (SSR, reduced motion, before/after the animation).
  const [animatedValue, setAnimatedValue] = useState<number | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimatedRef = useRef(false)
  const frameIdRef = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || hasAnimatedRef.current || !ref.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        hasAnimatedRef.current = true
        observer.disconnect()
        const start = performance.now()
        setAnimatedValue(0)

        const frame = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          const eased = 1 - Math.pow(1 - progress, 3)

          if (progress < 1) {
            setAnimatedValue(Math.round(value * eased))
            frameIdRef.current = requestAnimationFrame(frame)
          } else {
            frameIdRef.current = null
            setAnimatedValue(null)
          }
        }

        frameIdRef.current = requestAnimationFrame(frame)
      },
      { threshold: 0.5 },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [durationMs, prefersReducedMotion, value])

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  const displayValue = prefersReducedMotion ? value : (animatedValue ?? value)

  return (
    <span ref={ref}>
      {displayValue.toLocaleString('cs-CZ')}
      {suffix}
    </span>
  )
}
