'use client'

import { useEffect, useState } from 'react'

import { MessageCircle } from 'lucide-react'

import { siteContent } from '@/lib/content'

import { useBooking } from '@/src/contexts/BookingContext'

export default function WhatsAppButton() {
  const { selectedService } = useBooking()
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  useEffect(() => {
    const footerElement = document.querySelector('footer')

    if (!footerElement) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -20px 0px',
      },
    )

    observer.observe(footerElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  const getWhatsAppUrl = () => {
    let message = siteContent.floatingButtons.whatsappDefaultMessage

    if (selectedService) {
      message = siteContent.floatingButtons.whatsappSelectedServiceMessage.replace('{service}', selectedService)
    }

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  const canShowButton = !isFooterVisible

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-6 z-40'>
      <div className='mx-auto flex w-full max-w-6xl items-center px-5 md:px-8'>
        <a
          href={getWhatsAppUrl()}
          target='_blank'
          rel='noopener noreferrer'
          className={`pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 ${canShowButton ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-[10px] scale-[0.88] opacity-0'}`}
          style={{
            marginBottom: 'env(safe-area-inset-bottom)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            willChange: 'transform, opacity',
          }}
          aria-label={siteContent.floatingButtons.whatsappAriaLabel}
          tabIndex={canShowButton ? 0 : -1}
        >
          <span
            className={`absolute inset-0 rounded-full bg-[#25D366] ${canShowButton ? 'animate-ping [animation-duration:2s]' : 'opacity-0'}`}
            aria-hidden='true'
          />

          <MessageCircle className='relative z-10 h-5 w-5' />
        </a>
      </div>
    </div>
  )
}
