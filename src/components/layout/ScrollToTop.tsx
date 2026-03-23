'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

import { siteContent } from '@/lib/content'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 280)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className='pointer-events-none fixed right-4 bottom-6 z-40 md:right-8 md:bottom-8'>
      <div className='relative'>
        <AnimatePresence>
          {isVisible && (
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              onClick={scrollToTop}
              className='pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ca6f61] text-white shadow-lg transition hover:scale-105 hover:bg-[#b55d50]'
              style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
              aria-label={siteContent.floatingButtons.scrollTopLabel}
            >
              <ChevronUp className='h-6 w-6' />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}