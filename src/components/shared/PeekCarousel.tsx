'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface PeekCarouselProps {
  children: ReactNode[]
  ariaLabel: string
  itemClassName?: string
  className?: string
  fadeEdges?: boolean
  fadeColor?: string
  mobilePeek?: boolean
}

export default function PeekCarousel({
  children,
  ariaLabel,
  itemClassName,
  className,
  fadeEdges = false,
  fadeColor,
  mobilePeek = true,
}: PeekCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const getItemOffsets = (el: HTMLDivElement) => {
    return Array.from(el.children)
      .map((child) => (child as HTMLElement).offsetLeft)
      .filter((offset) => Number.isFinite(offset))
      .sort((a, b) => a - b)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const itemOffsets = getItemOffsets(el)
      const minScrollLeft = itemOffsets[0] ?? 0
      const hasOverflow = maxScrollLeft > 2

      if (mobilePeek && hasOverflow && el.scrollLeft < minScrollLeft - 1) {
        el.scrollLeft = minScrollLeft
      }

      setCanScrollLeft(hasOverflow && el.scrollLeft > minScrollLeft + 2)
      setCanScrollRight(hasOverflow && el.scrollLeft < maxScrollLeft - 2)
    }

    updateScrollState()

    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [children.length, mobilePeek])

  const scrollByCards = (direction: -1 | 1) => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const itemOffsets = getItemOffsets(el)
    const minScrollLeft = itemOffsets[0] ?? 0

    const tolerance = 2
    const step = el.clientWidth * 0.82
    const current = Math.max(el.scrollLeft, minScrollLeft)

    if (direction === 1) {
      const desired = current + step
      const nextOffset = itemOffsets.find((offset) => offset >= desired - tolerance)
      const target = typeof nextOffset === 'number' ? Math.min(nextOffset, maxScrollLeft) : maxScrollLeft
      el.scrollTo({ left: target, behavior: 'smooth' })
      return
    }

    const desired = current - step
    const previousOffsets = itemOffsets.filter((offset) => offset <= desired + tolerance)
    const target = previousOffsets.length > 0 ? previousOffsets[previousOffsets.length - 1] : minScrollLeft
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return
    }

    const el = containerRef.current
    if (!el) {
      return
    }

    setIsDragging(true)
    dragStartXRef.current = event.clientX
    dragStartScrollLeftRef.current = el.scrollLeft
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || event.pointerType !== 'mouse' || !containerRef.current) {
      return
    }

    const dx = event.clientX - dragStartXRef.current
    containerRef.current.scrollLeft = dragStartScrollLeftRef.current - dx
  }

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setIsDragging(false)
  }

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <button
        type='button'
        onClick={() => scrollByCards(-1)}
        className={cn(
          'absolute top-1/2 left-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition hover:bg-white md:flex',
          canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-label={`Posunout ${ariaLabel} doleva`}
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      <button
        type='button'
        onClick={() => scrollByCards(1)}
        className={cn(
          'absolute top-1/2 right-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition hover:bg-white md:flex',
          canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-label={`Posunout ${ariaLabel} doprava`}
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      {fadeEdges && fadeColor && canScrollLeft ? (
        <div
          className='pointer-events-none absolute top-0 left-0 z-10 h-full w-4 md:w-6'
          style={{ backgroundImage: `linear-gradient(to right, ${fadeColor} 16%, transparent 100%)` }}
        />
      ) : null}

      {fadeEdges && fadeColor && canScrollRight ? (
        <div
          className='pointer-events-none absolute top-0 right-0 z-10 h-full w-4 md:w-6'
          style={{ backgroundImage: `linear-gradient(to left, ${fadeColor} 16%, transparent 100%)` }}
        />
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          mobilePeek
            ? 'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[8%] pb-2 select-none touch-pan-x [-webkit-overflow-scrolling:touch] sm:px-0'
            : 'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 select-none touch-pan-x [-webkit-overflow-scrolling:touch]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn('w-[84%] shrink-0 snap-center sm:w-[46%] sm:snap-start lg:w-[31%]', itemClassName)}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
