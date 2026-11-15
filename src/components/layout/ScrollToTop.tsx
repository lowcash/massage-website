'use client'

import { useEffect, useState } from 'react'

import { ChevronUp } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { cn, scrollToSection } from '@/lib/utils'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'
import { useFooterVisible } from '@/src/hooks/useFooterVisible'
import { useHeroScrolledPast } from '@/src/hooks/useHeroScrolledPast'
import { useMediaQuery } from '@/src/hooks/useMediaQuery'
import { useRafThrottle } from '@/src/hooks/useRafThrottle'

const SHOW_SCROLL_THRESHOLD = 320
const HIDE_SCROLL_THRESHOLD = 220

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const isFooterVisible = useFooterVisible()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const heroPast = useHeroScrolledPast()

  const toggleVisibility = useRafThrottle(() => {
    // Use hysteresis to avoid visibility chattering around a single threshold.
    setIsVisible((prev) => (prev ? window.scrollY > HIDE_SCROLL_THRESHOLD : window.scrollY > SHOW_SCROLL_THRESHOLD))
  })

  useEffect(() => {
    toggleVisibility()
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [toggleVisibility])

  const scrollToTop = () => {
    scrollToSection('hero')
  }

  // Stack above the WhatsApp FAB (h-11 + gap); tighter inset on mobile with safe-area on the control.
  const canShowButton = isVisible && !isFooterVisible && (!isMobile || heroPast)

  return (
    <FloatingContainer className='bottom-[4rem] z-40 md:bottom-[5.25rem]' innerClassName='justify-end'>
      <button
        onClick={scrollToTop}
        className={cn(
          'bg-brand hover:bg-brand-hover shadow-soft pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-white',
          'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
          canShowButton
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-[10px] scale-[0.88] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100',
        )}
        style={{
          marginBottom: 'env(safe-area-inset-bottom, 0px)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        aria-label={siteContent.floatingButtons.scrollTopLabel}
        tabIndex={canShowButton ? 0 : -1}
      >
        <ChevronUp className='h-5 w-5' />
      </button>
    </FloatingContainer>
  )
}
