'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import studioImage1 from '@/src/assets/gallery-1.jpg'
import studioImage2 from '@/src/assets/gallery-2.jpg'
import studioImage3 from '@/src/assets/gallery-3.jpg'
import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { getAnimationConfigWithDelay, useReducedMotion } from '@/src/hooks/useReducedMotion'

const studioImages = [studioImage1, studioImage2, studioImage3]

export default function GalleryInteractive() {
  const shouldReduceMotion = useReducedMotion()
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (activeImageIndex === null) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [activeImageIndex])

  useEffect(() => {
    if (activeImageIndex === null) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => {
          if (prev === null) {
            return prev
          }

          return prev === 0 ? studioImages.length - 1 : prev - 1
        })
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((prev) => {
          if (prev === null) {
            return prev
          }

          return prev === studioImages.length - 1 ? 0 : prev + 1
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImageIndex])

  const showPreviousImage = () => {
    setActiveImageIndex((prev) => {
      if (prev === null) {
        return prev
      }

      return prev === 0 ? studioImages.length - 1 : prev - 1
    })
  }

  const showNextImage = () => {
    setActiveImageIndex((prev) => {
      if (prev === null) {
        return prev
      }

      return prev === studioImages.length - 1 ? 0 : prev + 1
    })
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) {
      return
    }

    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y

    touchStartRef.current = null

    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) {
      return
    }

    if (dx < 0) {
      showNextImage()
      return
    }

    showPreviousImage()
  }

  return (
    <>
      <motion.div {...getAnimationConfigWithDelay(shouldReduceMotion, 0.1)} className='lg:hidden'>
        <PeekCarousel
          ariaLabel={siteContent.studio.carouselAriaLabel}
          mobilePeek={false}
          itemClassName='w-full sm:w-[46%]'
          fadeEdges
          fadeColor='#f1e3df'
        >
          {siteContent.studio.images.map((image, index) => (
            <button
              key={image.id}
              type='button'
              onClick={() => setActiveImageIndex(index)}
              className='w-full cursor-pointer overflow-hidden rounded-xl border border-[#e0c5bf] bg-white text-left shadow-sm'
              aria-label={`Zobrazit fotografii: ${image.alt}`}
            >
              <div className='relative aspect-4/3 w-full'>
                <Image
                  src={studioImages[index]}
                  alt={image.alt}
                  fill
                  className='object-cover transition duration-300 hover:scale-[1.02]'
                  sizes='(min-width: 1024px) 35vw, (min-width: 640px) 46vw, 84vw'
                />
              </div>
            </button>
          ))}
        </PeekCarousel>
      </motion.div>

      <motion.div
        {...getAnimationConfigWithDelay(shouldReduceMotion, 0.1)}
        className='hidden grid-cols-3 gap-4 lg:grid'
      >
        {siteContent.studio.images.map((image, index) => (
          <button
            key={image.id}
            type='button'
            onClick={() => setActiveImageIndex(index)}
            className='w-full cursor-pointer overflow-hidden rounded-xl border border-[#e0c5bf] bg-white text-left shadow-sm'
            aria-label={`Zobrazit fotografii: ${image.alt}`}
          >
            <div className='relative aspect-4/3 w-full'>
              <Image
                src={studioImages[index]}
                alt={image.alt}
                fill
                className='object-cover transition duration-300 hover:scale-[1.02]'
                sizes='(min-width: 1024px) 31vw, 100vw'
              />
            </div>
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeImageIndex !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-70 flex cursor-default items-center justify-center bg-black/70 p-4 backdrop-blur-md md:p-8'
            onClick={() => setActiveImageIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className='relative flex w-full max-w-5xl cursor-default items-center justify-center'
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type='button'
                onClick={() => setActiveImageIndex(null)}
                className='absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65'
                aria-label='Zavřít náhled'
              >
                <X className='h-5 w-5' />
              </button>

              <button
                type='button'
                onClick={showPreviousImage}
                className='absolute left-3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65 md:flex'
                aria-label='Předchozí fotografie'
              >
                <ChevronLeft className='h-5 w-5' />
              </button>

              <div
                className='relative w-full overflow-hidden rounded-2xl'
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className='relative aspect-4/3 max-h-[82vh] w-full'>
                  <Image
                    src={studioImages[activeImageIndex]}
                    alt={siteContent.studio.images[activeImageIndex].alt}
                    fill
                    quality={90}
                    className='object-contain'
                    sizes='(min-width: 1280px) 1200px, 92vw'
                    priority
                  />
                </div>
              </div>

              <button
                type='button'
                onClick={showNextImage}
                className='absolute right-3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65 md:flex'
                aria-label='Další fotografie'
              >
                <ChevronRight className='h-5 w-5' />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
