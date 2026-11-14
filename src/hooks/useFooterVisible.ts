'use client'

import { useEffect, useState } from 'react'

/** True while the page `<footer>` intersects the viewport (with a small bottom inset). */
export function useFooterVisible(rootMargin = '0px 0px -20px 0px') {
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  useEffect(() => {
    const footerElement = document.querySelector('footer')
    if (!footerElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      { threshold: 0, rootMargin },
    )

    observer.observe(footerElement)
    return () => observer.disconnect()
  }, [rootMargin])

  return isFooterVisible
}
