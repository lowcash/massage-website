'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { useBooking } from '@/src/contexts/BookingContext'

export default function WhatsAppButton() {
  const { selectedService } = useBooking()

  const getWhatsAppUrl = () => {
    let message = siteContent.floatingButtons.whatsappDefaultMessage

    if (selectedService) {
      message = siteContent.floatingButtons.whatsappSelectedServiceMessage.replace(
        '{service}',
        selectedService
      )
    }

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className='pointer-events-none fixed bottom-6 left-5 z-40 md:left-8'>
      <div className='relative flex items-center'>
        <motion.a
          href={getWhatsAppUrl()}
          target='_blank'
          rel='noopener noreferrer'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ delay: 1 }}
          className='pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105'
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