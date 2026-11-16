'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { siteContent } from '@/lib/content'

import studioImage1 from '@/src/assets/gallery-1.jpg'
import studioImage2 from '@/src/assets/gallery-2.jpg'
import studioImage3 from '@/src/assets/gallery-3.jpg'
import { Dialog } from '@/src/components/shared/Dialog'
import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { Reveal } from '@/src/components/shared/Reveal'
import { useMediaQuery } from '@/src/hooks/useMediaQuery'

const studioImages = [studioImage1, studioImage2, studioImage3]

const TILE_CLASS = 'bg-surface-alt w-full cursor-pointer overflow-hidden rounded-(--radius-lg) text-left'
const IMAGE_CLASS = 'photo-soft object-cover'

export default function GalleryInteractive() {
  // Mount exactly one image tree. SSR / first paint = mobile carousel; desktop grid swaps in after hydration.
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isOpen = activeImageIndex !== null

  const closeLightbox = useCallback(() => setActiveImageIndex(null), [])

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === null ? prev : prev === 0 ? studioImages.length - 1 : prev - 1))
  }, [])

  const showNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === null ? prev : prev === studioImages.length - 1 ? 0 : prev + 1))
  }, [])

  // Escape + scroll lock + focus trap are handled by Dialog; only arrow navigation lives here.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        showPreviousImage()
      }

      if (event.key === 'ArrowRight') {
        showNextImage()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, showPreviousImage, showNextImage])

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

  const renderTile = (image: (typeof siteContent.studio.images)[number], index: number, sizes: string) => (
    <button
      key={image.id}
      type='button'
      onClick={() => setActiveImageIndex(index)}
      className={TILE_CLASS}
      aria-label={`Zobrazit fotografii: ${image.alt}`}
    >
      <div className='relative aspect-4/3 w-full'>
        <Image
          src={studioImages[index]}
          alt={image.alt}
          fill
          placeholder='blur'
          className={IMAGE_CLASS}
          sizes={sizes}
        />
      </div>
    </button>
  )

  return (
    <>
      {isDesktop ? (
        <Reveal soft className='grid grid-cols-3 gap-[var(--spacing-s2)]'>
          {siteContent.studio.images.map((image, index) => renderTile(image, index, '(min-width: 1024px) 31vw, 100vw'))}
        </Reveal>
      ) : (
        <Reveal soft>
          <PeekCarousel
            ariaLabel={siteContent.studio.carouselAriaLabel}
            mobilePeek={false}
            itemClassName='w-full sm:w-[46%]'
            fadeEdges
          >
            {siteContent.studio.images.map((image, index) => renderTile(image, index, '(min-width: 640px) 46vw, 84vw'))}
          </PeekCarousel>
        </Reveal>
      )}

      {/* Lightbox — Dialog handles Escape, focus trap, inert background and scroll lock */}
      <Dialog
        open={isOpen}
        onClose={closeLightbox}
        label='Náhled fotografie'
        className='z-80 cursor-default md:p-8'
        backdropClassName='z-80'
      >
        <div
          className={`relative flex w-full max-w-5xl cursor-default items-center justify-center transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'}`}
        >
          <button
            type='button'
            onClick={closeLightbox}
            className='absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white transition-colors duration-300 ease-out hover:bg-black/65'
            aria-label='Zavřít náhled'
          >
            <X className='h-5 w-5' />
          </button>

          <button
            type='button'
            onClick={showPreviousImage}
            className='absolute left-3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition-colors duration-300 ease-out hover:bg-black/65 md:flex'
            aria-label='Předchozí fotografie'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>

          <div
            className='relative w-full overflow-hidden rounded-(--radius-lg)'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {activeImageIndex !== null && (
              <div
                key={activeImageIndex}
                className='animate-in fade-in relative aspect-4/3 max-h-[82vh] w-full duration-500 ease-out motion-reduce:animate-none'
              >
                <Image
                  src={studioImages[activeImageIndex]}
                  alt={siteContent.studio.images[activeImageIndex].alt}
                  fill
                  placeholder='blur'
                  quality={90}
                  className='object-contain'
                  sizes='(min-width: 1280px) 1200px, 92vw'
                  priority
                />
              </div>
            )}
          </div>

          <button
            type='button'
            onClick={showNextImage}
            className='absolute right-3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition-colors duration-300 ease-out hover:bg-black/65 md:flex'
            aria-label='Další fotografie'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </Dialog>
    </>
  )
}
