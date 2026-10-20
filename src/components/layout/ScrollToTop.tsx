'use client'

import { useEffect, useState } from 'react'

import { ChevronUp } from 'lucide-react'

import { siteContent } from '@/lib/content'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'

const SHOW_SCROLL_THRESHOLD = 320
const HIDE_SCROLL_THRESHOLD = 220

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Use hysteresis to avoid visibility chattering around a single threshold.
      setIsVisible((prev) => (prev ? window.scrollY > HIDE_SCROLL_THRESHOLD : window.scrollY > SHOW_SCROLL_THRESHOLD))
    }

    toggleVisibility()
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
        threshold: 0,
        rootMargin: '0px 0px -20px 0px',
      },
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
    <FloatingContainer className='bottom-6 z-40' innerClassName='justify-end'>
      <button
        onClick={scrollToTop}
        className={`bg-brand hover:bg-brand-hover pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out ${canShowButton ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-[10px] scale-[0.88] opacity-0'}`}
        style={{
          marginBottom: 'env(safe-area-inset-bottom)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
        aria-label={siteContent.floatingButtons.scrollTopLabel}
        tabIndex={canShowButton ? 0 : -1}
      >
        <ChevronUp className='h-5 w-5' />
      </button>
    </FloatingContainer>
  )
}
