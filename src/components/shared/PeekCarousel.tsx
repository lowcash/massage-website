'use client'

import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface PeekCarouselProps {
  children: ReactNode[]
  ariaLabel: string
  itemClassName?: string
  className?: string
  fadeEdges?: boolean
  fadeColor?: string
}

export default function PeekCarousel({
  children,
  ariaLabel,
  itemClassName,
  className,
  fadeEdges = false,
  fadeColor,
}: PeekCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startScrollLeft, setStartScrollLeft] = useState(0)

  const scrollByCards = (direction: -1 | 1) => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const distance = el.clientWidth * 0.82 * direction
    el.scrollBy({ left: distance, behavior: 'smooth' })
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) {
      return
    }

    setIsDragging(true)
    setStartX(event.clientX)
    setStartScrollLeft(el.scrollLeft)
  }

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) {
      return
    }

    const dx = event.clientX - startX
    containerRef.current.scrollLeft = startScrollLeft - dx
  }

  const stopDragging = () => {
    setIsDragging(false)
  }

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <button
        type='button'
        onClick={() => scrollByCards(-1)}
        className='absolute top-1/2 left-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition hover:bg-white md:flex'
        aria-label={`Posunout ${ariaLabel} doleva`}
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      <button
        type='button'
        onClick={() => scrollByCards(1)}
        className='absolute top-1/2 right-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition hover:bg-white md:flex'
        aria-label={`Posunout ${ariaLabel} doprava`}
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      {fadeEdges && fadeColor ? (
        <>
          <div
            className='pointer-events-none absolute top-0 left-0 z-10 h-full w-10 md:w-16'
            style={{ backgroundImage: `linear-gradient(to right, ${fadeColor}, transparent)` }}
          />
          <div
            className='pointer-events-none absolute top-0 right-0 z-10 h-full w-10 md:w-16'
            style={{ backgroundImage: `linear-gradient(to left, ${fadeColor}, transparent)` }}
          />
        </>
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 pl-1 pr-[14%] select-none md:pr-[10%]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              'w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]',
              itemClassName
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
