'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import studioImage1 from '@/src/assets/529868a68c329f2cd79b11f95989565412c07b61.png'
import studioImage2 from '@/src/assets/2d115fb3cb1c74e407bde90bbf7d740b4c3604f2.png'
import studioImage3 from '@/src/assets/669702bfa59a3e8017fcb4cb9cbf4fe49cedcddf.png'

const studioImages = [studioImage1, studioImage2, studioImage3]

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion()
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

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

  return (
    <section id='studio' className='bg-[#f1e3df] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='studio-heading'
            title={siteContent.studio.heading}
            subtitle={siteContent.studio.subtitle}
          />
        </motion.div>

        <motion.div {...getAnimationConfigWithDelay(shouldReduceMotion, 0.1)}>
          <PeekCarousel
            ariaLabel={siteContent.studio.carouselAriaLabel}
            fadeEdges
            fadeColor='#f1e3df'
          >
            {siteContent.studio.images.map((image, index) => (
              <button
                key={image.id}
                type='button'
                onClick={() => setActiveImageIndex(index)}
                className='w-full overflow-hidden rounded-xl border border-[#e0c5bf] bg-white text-left shadow-sm'
                aria-label={`Zobrazit fotografii: ${image.alt}`}
              >
                <div className='relative aspect-4/3 w-full'>
                  <Image
                    src={studioImages[index]}
                    alt={image.alt}
                    fill
                    className='object-cover transition duration-300 hover:scale-[1.02]'
                    sizes='(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 84vw'
                  />
                </div>
              </button>
            ))}
          </PeekCarousel>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeImageIndex !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 md:p-8'
            onClick={() => setActiveImageIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className='relative flex w-full max-w-5xl items-center justify-center'
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

              <div className='relative w-full overflow-hidden rounded-2xl'>
                <div className='relative aspect-[4/3] w-full max-h-[82vh]'>
                  <Image
                    src={studioImages[activeImageIndex]}
                    alt={siteContent.studio.images[activeImageIndex].alt}
                    fill
                    className='object-contain'
                    sizes='90vw'
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
    </section>
  )
}
