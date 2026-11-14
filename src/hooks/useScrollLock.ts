'use client'

import { useEffect, useRef } from 'react'

type ScrollLockMode = 'fixed' | 'overflow'

/**
 * Locks document scroll while `locked` is true.
 * - `fixed`: iOS-safe body position:fixed (drawers)
 * - `overflow`: overflow:hidden on html+body (lightboxes)
 *
 * Returns a ref that holds the scrollY captured at lock time (for restore).
 */
export function useScrollLock(locked: boolean, mode: ScrollLockMode = 'overflow') {
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!locked) return

    const { body } = document
    const root = document.documentElement

    if (mode === 'fixed') {
      const scrollY = window.scrollY
      scrollYRef.current = scrollY
      const previousOverflow = body.style.overflow
      const previousPosition = body.style.position
      const previousTop = body.style.top
      const previousWidth = body.style.width

      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.width = '100%'

      return () => {
        body.style.overflow = previousOverflow
        body.style.position = previousPosition
        body.style.top = previousTop
        body.style.width = previousWidth

        const previousScrollBehavior = root.style.scrollBehavior
        root.style.scrollBehavior = 'auto'
        window.scrollTo(0, scrollY)
        root.style.scrollBehavior = previousScrollBehavior
      }
    }

    const previousBodyOverflow = body.style.overflow
    const previousRootOverflow = root.style.overflow
    body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      root.style.overflow = previousRootOverflow
    }
  }, [locked, mode])

  return scrollYRef
}
