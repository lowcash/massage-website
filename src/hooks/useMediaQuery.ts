'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * SSR-safe media query. Returns `serverValue` on the server and during hydration,
 * then the live match state.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onStoreChange)
      return () => media.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}
