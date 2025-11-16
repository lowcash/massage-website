'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { SECTION } from '@/const'

import IMAGE1 from '@/app/assets/carousel/1.jpeg'
import IMAGE2 from '@/app/assets/carousel/2.jpeg'
import IMAGE3 from '@/app/assets/carousel/3.jpeg'
import IMAGE4 from '@/app/assets/carousel/4.jpeg'
import IMAGE5 from '@/app/assets/carousel/5.jpeg'
import IMAGE6 from '@/app/assets/carousel/6.jpeg'

const carouselImages = [IMAGE1, IMAGE2, IMAGE3, IMAGE4, IMAGE5, IMAGE6]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext()
    }
    if (touchStart - touchEnd < -75) {
      goToPrevious()
    }
  }

  const scrollToServices = () => {
    const element = document.getElementById('sluzby')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id={SECTION.HERO.id}
      className='relative h-screen w-full overflow-hidden'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Images with Crossfade */}
      <div className='absolute inset-0'>
        {carouselImages.map((image, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1.05 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: { duration: 12, ease: 'linear' },
            }}
            className='absolute inset-0'
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              zIndex: index === currentIndex ? 1 : 0,
            }}
          >
            <Image
              src={image}
              alt={`Masážní služby ${index + 1}`}
              fill
              className='object-cover'
              priority={index < 2}
              quality={90}
            />
            {/* Dark overlay with blur for text readability */}
            <div className='absolute inset-0 bg-black/30 backdrop-blur-[2px]' />
          </motion.div>
        ))}
      </div>

      {/* Content - Always visible with high z-index */}
      <div className='relative z-20 h-full flex flex-col items-center justify-center text-center px-6 md:px-16'>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }}
          className='text-white mb-6'
          style={{
            fontFamily: 'Dancing Script',
            fontSize: '3.5rem',
            lineHeight: '1.2',
            letterSpacing: '0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.7)',
          }}
        >
          Pohlazení po těle a duši
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }}
          className='text-white text-xl mb-10 max-w-2xl'
          style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.8)',
            lineHeight: '1.8',
            letterSpacing: '0.02em',
          }}
        >
          Dotek, který uleví - péče, která obnoví.
        </motion.p>
        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToServices}
          className='group px-8 py-3 bg-white/75 backdrop-blur-[24px] border-2 border-white/70 rounded-full transition-all duration-300 hover:bg-white hover:border-white hover:shadow-xl cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
        >
          <span
            className='text-[#de397e] group-hover:text-[#c4a75f] transition-colors duration-300'
            style={{ fontFamily: 'Dancing Script', fontSize: '1.4rem' }}
          >
            Vyberte si masáž
          </span>
        </motion.button>
      </div>

      {/* Navigation Arrows - desktop only */}
      <div className='hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 z-20'>
        <div className='container mx-auto px-6 md:px-16 max-w-7xl'>
          <div className='relative'>
            <button
              onClick={goToPrevious}
              className='absolute left-0 p-3 bg-white/60 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/80 cursor-pointer'
              aria-label='Předchozí obrázek'
            >
              <ChevronLeft className='w-6 h-6 text-[#de397e]' />
            </button>
            <button
              onClick={goToNext}
              className='absolute right-0 p-3 bg-white/60 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/80 cursor-pointer'
              aria-label='Další obrázek'
            >
              <ChevronRight className='w-6 h-6 text-[#de397e]' />
            </button>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3'>
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full drop-shadow-lg cursor-pointer ${
              index === currentIndex ? 'bg-white w-8 h-3' : 'bg-white/50 w-3 h-3 hover:bg-white/75'
            }`}
            aria-label={`Přejít na obrázek ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
