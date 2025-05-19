'use client'

import { useState, useEffect } from 'react'
import { StaticImageData } from 'next/image'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { CAROUSEL_AUTOPLAY_SPEED_MS } from '@/const'

interface Props {
  images: StaticImageData[]
}

export default function HeroImageCarousel(p: Props) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % p.images.length)
    }, CAROUSEL_AUTOPLAY_SPEED_MS)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? p.images.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % p.images.length)
  }

  return (
    <>
      {/* Carousel background images with blend effect */}
      <div className='absolute inset-0 z-0'>
        <div className='carousel-container relative h-full w-full'>
          {p.images.map((image, index) => (
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
        className='absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 text-white/70 transition-colors hover:text-white md:block'
        onClick={goToPrevSlide}
      >
        <ChevronLeft className='h-8 w-8 stroke-[1.5]' />
      </button>
      <button
        className='absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 text-white/70 transition-colors hover:text-white md:block'
        onClick={goToNextSlide}
      >
        <ChevronRight className='h-8 w-8 stroke-[1.5]' />
      </button>
      {/* Carousel indicators */}
      <div className='absolute right-0 bottom-8 left-0 z-10 flex justify-center'>
        {Array.from({ length: p.images.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-bc6290 w-6' : 'bg-white/70'}`}
          />
        ))}
      </div>
    </>
  )
}
