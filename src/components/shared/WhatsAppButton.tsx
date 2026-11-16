'use client'

import { MessageCircle } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'
import { useBooking } from '@/src/contexts/BookingContext'
import { useBookingInView } from '@/src/hooks/useBookingInView'
import { useFooterVisible } from '@/src/hooks/useFooterVisible'
import { useHeroScrolledPast } from '@/src/hooks/useHeroScrolledPast'
import { useMediaQuery } from '@/src/hooks/useMediaQuery'

export default function WhatsAppButton() {
  const { selectedService } = useBooking()
  const isFooterVisible = useFooterVisible()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const heroPast = useHeroScrolledPast()
  const bookingInView = useBookingInView()

  const getWhatsAppUrl = () => {
    let message = siteContent.floatingButtons.whatsappDefaultMessage

    if (selectedService) {
      message = siteContent.floatingButtons.whatsappSelectedServiceMessage.replace('{service}', selectedService)
    }

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  // On mobile, wait until the hero is fully past so the FAB never covers CTAs.
  // While the booking card is on screen (phone), the slots and CTA need the right edge: the card has its own WhatsApp CTA.
  const canShowButton = !isFooterVisible && (!isMobile || (heroPast && !bookingInView))

  return (
    <FloatingContainer className='bottom-3 z-40 md:bottom-6' innerClassName='justify-end'>
      <a
        href={getWhatsAppUrl()}
        target='_blank'
        rel='noopener noreferrer'
        className={cn(
          'bg-whatsapp hover:bg-whatsapp-hover shadow-soft pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full text-white',
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
        aria-label={siteContent.floatingButtons.whatsappAriaLabel}
        tabIndex={canShowButton ? 0 : -1}
      >
        <span
          className={cn(
            'bg-whatsapp absolute inset-0 rounded-full',
            canShowButton ? 'motion-safe:animate-whatsapp-pulse' : 'opacity-0',
          )}
          aria-hidden='true'
        />

        <MessageCircle className='relative z-10 h-5 w-5' />
      </a>
    </FloatingContainer>
  )
}
