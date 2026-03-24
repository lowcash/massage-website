'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface HeroScrollCueProps {
  href: string
  ariaLabel: string
}

export default function HeroScrollCue({ href, ariaLabel }: HeroScrollCueProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <a
      href={href}
      className='fixed bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/75 transition hover:text-white motion-safe:animate-bounce'
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      aria-label={ariaLabel}
    >
      <ChevronDown className='h-8 w-8' />
    </a>
  )
}
