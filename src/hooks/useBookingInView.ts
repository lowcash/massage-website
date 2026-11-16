'use client'

import { useEffect, useState } from 'react'

/** True while the booking card (slot grid, summary, CTA) intersects the viewport; floating buttons step aside then. */
export function useBookingInView() {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const card = document.querySelector('#booking [data-booking-card]')
    if (!card) return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return inView
}
