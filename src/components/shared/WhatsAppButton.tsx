'use client'

import { MessageCircle } from 'lucide-react'

import { siteContent } from '@/lib/content'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'
import { useBooking } from '@/src/contexts/BookingContext'
import { useFooterVisible } from '@/src/hooks/useFooterVisible'

export default function WhatsAppButton() {
  const { selectedService } = useBooking()
  const isFooterVisible = useFooterVisible()

  const getWhatsAppUrl = () => {
    let message = siteContent.floatingButtons.whatsappDefaultMessage

    if (selectedService) {
      message = siteContent.floatingButtons.whatsappSelectedServiceMessage.replace('{service}', selectedService)
    }

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  const canShowButton = !isFooterVisible

  return (
    <FloatingContainer className='bottom-6 z-40' innerClassName='justify-start'>
      <a
        href={getWhatsAppUrl()}
        target='_blank'
        rel='noopener noreferrer'
        className={`bg-whatsapp hover:bg-whatsapp-hover pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out ${canShowButton ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-[10px] scale-[0.88] opacity-0'}`}
        style={{
          marginBottom: 'env(safe-area-inset-bottom)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        aria-label={siteContent.floatingButtons.whatsappAriaLabel}
        tabIndex={canShowButton ? 0 : -1}
      >
        <span
          className={`bg-whatsapp absolute inset-0 rounded-full ${canShowButton ? 'motion-safe:animate-whatsapp-pulse' : 'opacity-0'}`}
          aria-hidden='true'
        />

        <MessageCircle className='relative z-10 h-5 w-5' />
      </a>
    </FloatingContainer>
  )
}
