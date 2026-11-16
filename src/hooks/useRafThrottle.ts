'use client'

import { useCallback, useEffect, useRef } from 'react'

/** Coalesce bursty events (scroll/resize) to one callback per animation frame. */
export function useRafThrottle(callback: () => void) {
  const frameRef = useRef<number | null>(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        // Reset, or the StrictMode effect re-run (dev) leaves a dead frame id and every later call is ignored.
        frameRef.current = null
      }
    }
  }, [])

  return useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      callbackRef.current()
    })
  }, [])
}
