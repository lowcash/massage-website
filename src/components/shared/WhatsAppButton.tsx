'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
        <motion.a
          href={getWhatsAppUrl()}
          target='_blank'
          rel='noopener noreferrer'
          initial={false}
          animate={{
            opacity: canShowButton ? 1 : 0,
            scale: canShowButton ? 1 : 0.88,
            y: canShowButton ? 0 : 10,
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 ${canShowButton ? '' : 'pointer-events-none'}`}
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
          <motion.div
            animate={canShowButton ? { scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] } : { scale: 1, opacity: 0 }}
            transition={canShowButton ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            className='absolute inset-0 rounded-full bg-[#25D366]'
          />

          <MessageCircle className='relative z-10 h-5 w-5' />
        </motion.a>
      </div>
    </div>
  )
}
