'use client'

import { useRef } from 'react'
import Image, { StaticImageData } from 'next/image'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { CAROUSEL_AUTOPLAY_SPEED_MS } from '@/const'
import { useCarousel } from '@/hooks/use-carousel'

interface Props {
  images: StaticImageData[]
  carouselState?: ReturnType<typeof useCarousel>
}

export default function HeroImageCarousel(p: Props) {
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const defaultCarousel = useCarousel({
    imagesLength: p.images.length,
    autoplaySpeed: CAROUSEL_AUTOPLAY_SPEED_MS,
  })

  const carousel = p.carouselState || defaultCarousel

  return (
    <>
      {/* Carousel background images with blend effect */}
      <div 
        ref={carouselRef}
        className='absolute inset-0 z-0 select-none'
        onTouchStart={carousel.handleTouchStart}
        onTouchMove={carousel.handleTouchMove}
        onTouchEnd={carousel.handleTouchEnd}
        onMouseEnter={carousel.handleMouseEnter}
        onMouseLeave={carousel.handleMouseLeave}
      >
        <div className='carousel-container relative h-full w-full'>
          {p.images.map((image, index) => (
            <Image
              key={index}
              className='carousel-item absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-soft-light transition-opacity duration-1500'
              alt={`CarouselImage_${index}`}
              src={image.src}
              fill
              priority={index === 0} // Load first image immediately
              style={{
                objectFit: 'cover',
                opacity: index === carousel.activeSlide ? 1 : 0,
                zIndex: index === carousel.activeSlide ? 2 : 1,
              }}
            />
          ))}
          <div className='absolute inset-0 bg-gradient-to-b from-white/70 to-black/40'></div>
        </div>
      </div>
      {/* Carousel controls */}
      <button
        className='absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 text-white/70 transition-colors hover:text-white md:block'
        onClick={carousel.goToPrevSlide}
        aria-label="Předchozí obrázek"
      >
        <ChevronLeft className='h-8 w-8 stroke-[1.5]' />
      </button>
      <button
        className='absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 text-white/70 transition-colors hover:text-white md:block'
        onClick={carousel.goToNextSlide}
        aria-label="Další obrázek"
      >
        <ChevronRight className='h-8 w-8 stroke-[1.5]' />
      </button>
      {/* Carousel indicators */}
      <div className='absolute right-0 bottom-8 left-0 z-10 flex justify-center'>
        {Array.from({ length: p.images.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => carousel.goToSlide(index)}
            className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${index === carousel.activeSlide ? 'bg-[#de397e] w-6' : 'bg-white/70'}`}
            aria-label={`Přejít na obrázek ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}
