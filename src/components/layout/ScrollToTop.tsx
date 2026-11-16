'use client'

import { ChevronUp } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { cn, scrollToSection } from '@/lib/utils'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'
import { useBookingInView } from '@/src/hooks/useBookingInView'
import { useFooterVisible } from '@/src/hooks/useFooterVisible'
import { useHeroScrolledPast } from '@/src/hooks/useHeroScrolledPast'
import { useMediaQuery } from '@/src/hooks/useMediaQuery'

export default function ScrollToTop() {
  const isFooterVisible = useFooterVisible()
  const heroPast = useHeroScrolledPast()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const bookingInView = useBookingInView()

  const scrollToTop = () => {
    scrollToSection('hero')
  }

  // Shown only once the hero is fully scrolled past (a short page needs no way back up). Stacked 12px above the
  // WhatsApp FAB (same 44px size, quieter outline style so the two do not compete).
  const canShowButton = heroPast && !isFooterVisible && !(isMobile && bookingInView)

  return (
    <FloatingContainer className='bottom-[4.25rem] z-40 md:bottom-20' innerClassName='justify-end'>
      <button
        onClick={scrollToTop}
        className={cn(
          'bg-paper text-ink border-ink/30 hover:bg-surface-alt shadow-soft pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border',
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
