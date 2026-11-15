'use client'

import { useEffect } from 'react'

/**
 * Fallback for browsers without scroll-driven animations (animation-timeline: view()).
 * Renders nothing. Content stays fully visible unless this effect runs, supports no
 * view timelines and the visitor accepts motion; only then `.js .reveal` starts hidden.
 */
export function RevealFallback() {
  useEffect(() => {
    const supportsViewTimeline = CSS.supports('animation-timeline', 'view()')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (supportsViewTimeline || prefersReducedMotion) {
      return
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-soft, .reveal-media'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 },
    )

    document.documentElement.classList.add('js')
    for (const target of targets) {
      observer.observe(target)
    }

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('js')
    }
  }, [])

  return null
}
