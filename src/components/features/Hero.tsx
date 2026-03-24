'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'
import heroImage from '@/src/assets/hero.jpg'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [hasUserScrolled, setHasUserScrolled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const updateMedia = () => {
      setIsDesktop(media.matches)
    }

    updateMedia()
    media.addEventListener('change', updateMedia)

    return () => {
      media.removeEventListener('change', updateMedia)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      if (window.scrollY > 12) {
        setHasUserScrolled(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToBooking = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id='hero' className='relative flex min-h-svh items-center justify-center overflow-hidden'>
      <div
        className='absolute inset-0 scale-[1.06]'
        style={{ transform: isDesktop ? `translateY(${scrollY * 0.25}px) scale(1.06)` : 'scale(1.06)' }}
      >
        <Image
          src={heroImage}
          alt={siteContent.hero.imageAlt}
          fill
          priority
          className='object-cover'
          sizes='100vw'
        />
      </div>

      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(41,30,26,0.18),rgba(24,15,12,0.64))]' />

      <motion.div
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className='relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-16 text-center text-white md:gap-8'
      >
        <div className='pointer-events-none absolute inset-x-5 top-1/2 -z-10 h-[62%] -translate-y-1/2 rounded-4xl bg-black/24 blur-2xl md:inset-x-12 md:h-[58%] md:bg-black/20' />

        <p className='text-sm tracking-[0.24em] text-white/85 uppercase'>
          {applyCzechNbsp(siteContent.brand.subtitle)}
        </p>

        <h1 className='text-shadow max-w-4xl text-5xl leading-[1.1] md:text-7xl' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {applyCzechNbsp(siteContent.hero.title)}
        </h1>

        <p className='text-shadow max-w-2xl text-[15px] leading-relaxed text-white/90 md:text-xl'>
          {applyCzechNbsp(siteContent.hero.subtitle)}
        </p>

        <button
          type='button'
          onClick={scrollToBooking}
          className='rounded-md bg-[#ca6f61] px-8 py-3 text-sm tracking-widest text-white uppercase transition hover:bg-[#b55d50]'
        >
          {applyCzechNbsp(siteContent.hero.cta)}
        </button>
      </motion.div>

      {!hasUserScrolled && (
        <motion.button
          type='button'
          onClick={scrollToBooking}
          className='absolute bottom-16 left-1/2 z-20 -translate-x-1/2 text-white/75 transition hover:text-white sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]'
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label={siteContent.hero.scrollIndicatorAriaLabel}
        >
          <ChevronDown className='h-8 w-8' />
        </motion.button>
      )}
    </section>
  )
}