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
        threshold: 0.02,
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

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-40 transition-opacity duration-250 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className='mx-auto flex w-full max-w-6xl items-center px-5 md:px-8'>
        <motion.a
          href={getWhatsAppUrl()}
          target='_blank'
          rel='noopener noreferrer'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isFooterVisible ? 0 : 1, scale: isFooterVisible ? 0.88 : 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ delay: 1, duration: 0.22 }}
          className={`pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 ${isFooterVisible ? 'pointer-events-none' : ''}`}
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label={siteContent.floatingButtons.whatsappAriaLabel}
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='absolute inset-0 rounded-full bg-[#25D366]'
          />

          <MessageCircle className='relative z-10 h-5 w-5' />
        </motion.a>
      </div>
    </div>
  )
}
