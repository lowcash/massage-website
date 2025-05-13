'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollToElement } from '@/hooks/useScrollToElement'

import { CAROUSEL_AUTOPLAY_SPEED_MS, SECTION, SUBTITLE, TITLE } from '@/const'
import IMAGE1 from '@/app/assets/carousel_1.jpeg'
import IMAGE2 from '@/app/assets/carousel_2.jpeg'
import IMAGE3 from '@/app/assets/carousel_3.jpeg'

const IMAGES = [IMAGE1, IMAGE2, IMAGE3]

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)

  const scrollToCalendar = useScrollToElement()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % IMAGES.length)
    }, CAROUSEL_AUTOPLAY_SPEED_MS)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % IMAGES.length)
  }

  return (
    <section id='hero' className='relative h-[85vh] overflow-hidden md:h-screen'>
      {/* Carousel background images with blend effect */}
      <div className='absolute inset-0 z-0'>
        <div className='carousel-container relative h-full w-full'>
          {[IMAGE1, IMAGE2, IMAGE3].map((image, index) => (
            <div
              key={index}
              className='carousel-item absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-soft-light transition-opacity duration-1500'
              style={{
                backgroundImage: `url('${image.src}')`,
                opacity: index === activeSlide ? 1 : 0,
                zIndex: index === activeSlide ? 2 : 1,
              }}
            >
              <div className='absolute inset-0 bg-gradient-to-b from-white/70 to-black/40'></div>
            </div>
          ))}
        </div>
      </div>
      {/* Carousel controls */}
      <button
        className='absolute top-1/2 left-4 z-20 -translate-y-1/2 text-white/70 transition-colors hover:text-white'
        onClick={goToPrevSlide}
      >
        <ChevronLeft className='h-8 w-8 stroke-[1.5]' />
      </button>
      <button
        className='absolute top-1/2 right-4 z-20 -translate-y-1/2 text-white/70 transition-colors hover:text-white'
        onClick={goToNextSlide}
      >
        <ChevronRight className='h-8 w-8 stroke-[1.5]' />
      </button>
      {/* Content overlay - centered with consistent visibility */}
      <div className='hero-content flex h-full flex-col items-center justify-center px-4'>
        <div className='z-10 max-w-3xl text-center'>
          <h2
            className='font-dancing animate-fade-in mb-6 text-3xl text-[rgb(239,219,229)] drop-shadow-sm md:text-5xl lg:text-6xl'
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            {TITLE}
          </h2>
          <p
            className='animate-slide-up mb-8 font-sans text-lg text-white/90 md:text-xl'
            style={{ animationDelay: '0.3s' }}
          >
            {SUBTITLE}
          </p>
          <button
            onClick={() => scrollToCalendar(SECTION.SERVICES.id)}
            className='cta-button animate-slide-up rounded-full border border-white px-8 py-3 text-sm font-light tracking-wider text-white uppercase transition-all duration-500'
            style={{ animationDelay: '0.6s' }}
          >
            Rezervovat
          </button>
        </div>
      </div>
      {/* Carousel indicators */}
      <div className='absolute right-0 bottom-8 left-0 z-10 flex justify-center'>
        {Array.from({ length: IMAGES.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-bc6290 w-6' : 'bg-white/70'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
