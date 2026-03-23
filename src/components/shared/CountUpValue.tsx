'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpValueProps {
  value: number
  suffix?: string
  durationMs?: number
}

export default function CountUpValue({ value, suffix = '', durationMs = 1200 }: CountUpValueProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current || hasAnimated) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        setHasAnimated(true)
        const start = performance.now()

        const frame = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplayValue(Math.round(value * eased))

          if (progress < 1) {
            requestAnimationFrame(frame)
          }
        }

        requestAnimationFrame(frame)
        observer.disconnect()
      },
      { threshold: 0.5 }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [durationMs, hasAnimated, value])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString('cs-CZ')}
      {suffix}
    </span>
  )
}
