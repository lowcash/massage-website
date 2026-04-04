'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options },
    )

    // Defer observing by one paint frame so the browser commits the initial
    // hidden CSS state before the observer fires. Without this, elements
    // already in the viewport on first render skip their entrance animation.
    const rafId = requestAnimationFrame(() => {
      observer.observe(el)
    })

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return { ref, inView }
}
