'use client'

import { useEffect, useState } from 'react'

import { useRafThrottle } from '@/src/hooks/useRafThrottle'

/**
 * True once `#hero` has fully scrolled above the viewport.
 * Used to defer mobile floating chrome so it never covers hero CTAs.
 */
export function useHeroScrolledPast() {
  const [past, setPast] = useState(false)

  const update = useRafThrottle(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    setPast(hero.getBoundingClientRect().bottom <= 0)
  })

  useEffect(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  return past
}
