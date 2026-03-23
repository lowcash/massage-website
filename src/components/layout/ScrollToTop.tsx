'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className='pointer-events-none fixed right-5 bottom-6 z-40 md:right-8'>
      <div className='relative'>
        <motion.button
          initial={false}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.88,
            y: isVisible ? 0 : 10,
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={scrollToTop}
          className='pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#ca6f61] text-white shadow-lg transition hover:scale-105 hover:bg-[#b55d50]'
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label={siteContent.floatingButtons.scrollTopLabel}
          tabIndex={isVisible ? 0 : -1}
        >
          <ChevronUp className='h-5 w-5' />
        </motion.button>
      </div>
    </div>
  )
}