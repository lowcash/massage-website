'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

import { siteContent } from '@/lib/content'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 280)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

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
      }
    )

    observer.observe(footerElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const canShowButton = isVisible && !isFooterVisible

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-6 z-40'>
      <div className='mx-auto flex w-full max-w-6xl justify-end px-5 md:px-8'>
        <motion.button
          initial={false}
          animate={{
            opacity: canShowButton ? 1 : 0,
            scale: canShowButton ? 1 : 0.88,
            y: canShowButton ? 0 : 10,
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={scrollToTop}
          className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#ca6f61] text-white shadow-lg transition hover:scale-105 hover:bg-[#b55d50] ${canShowButton ? '' : 'pointer-events-none'}`}
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label={siteContent.floatingButtons.scrollTopLabel}
          tabIndex={canShowButton ? 0 : -1}
        >
          <ChevronUp className='h-5 w-5' />
        </motion.button>
      </div>
    </div>
  )
}