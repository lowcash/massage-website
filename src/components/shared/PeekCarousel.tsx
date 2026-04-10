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
  const isDraggingRef = useRef(false)
  const dragDidMoveRef = useRef(false)
  const DRAG_THRESHOLD = 5
  const [isDragging, setIsDragging] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const getItemOffsets = (el: HTMLDivElement) => {
    return Array.from(el.children)
      .map((child) => (child as HTMLElement).offsetLeft)
      .filter((offset) => Number.isFinite(offset))
      .sort((a, b) => a - b)
  }

  const getScrollBounds = (el: HTMLDivElement) => {
    const itemOffsets = getItemOffsets(el)
    const minScrollLeft = 0
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth)

    return { itemOffsets, minScrollLeft, maxScrollLeft }
  }

  const clampScrollLeft = (value: number, minScrollLeft: number, maxScrollLeft: number) => {
    return Math.min(maxScrollLeft, Math.max(minScrollLeft, value))
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const updateScrollState = () => {
      const { minScrollLeft, maxScrollLeft } = getScrollBounds(el)
      const hasOverflow = maxScrollLeft > 2
      const clampedScrollLeft = clampScrollLeft(el.scrollLeft, minScrollLeft, maxScrollLeft)

      if (Math.abs(clampedScrollLeft - el.scrollLeft) > 0.5) {
        el.scrollLeft = clampedScrollLeft
      }

      setCanScrollLeft(hasOverflow && clampedScrollLeft > minScrollLeft + 2)
      setCanScrollRight(hasOverflow && clampedScrollLeft < maxScrollLeft - 2)
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

    const { itemOffsets, minScrollLeft, maxScrollLeft } = getScrollBounds(el)

    const tolerance = 2
    const step = el.clientWidth * 0.82
    const current = clampScrollLeft(el.scrollLeft, minScrollLeft, maxScrollLeft)

    if (direction === 1) {
      const nextOffsets = itemOffsets.filter((offset) => offset > current + tolerance)
      const desired = current + step
      const nextOffset = nextOffsets.find((offset) => offset >= desired - tolerance)
      const fallbackNextOffset = nextOffsets.length > 0 ? nextOffsets[0] : maxScrollLeft
      const target = clampScrollLeft(
        typeof nextOffset === 'number' ? nextOffset : fallbackNextOffset,
        minScrollLeft,
        maxScrollLeft,
      )
      el.scrollTo({ left: target, behavior: 'smooth' })
      return
    }

    const previousOffsets = itemOffsets.filter((offset) => offset < current - tolerance)
    const desired = current - step
    const candidates = previousOffsets.filter((offset) => offset <= desired + tolerance)
    const fallbackPreviousOffset =
      previousOffsets.length > 0 ? previousOffsets[previousOffsets.length - 1] : minScrollLeft
    const targetOffset = candidates.length > 0 ? candidates[candidates.length - 1] : fallbackPreviousOffset
    const target = clampScrollLeft(targetOffset, minScrollLeft, maxScrollLeft)
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

    dragDidMoveRef.current = false
    dragStartXRef.current = event.clientX
    dragStartScrollLeftRef.current = el.scrollLeft
    // Mark as tracking (not yet dragging — drag starts after threshold)
    isDraggingRef.current = false
    // Only capture pointer when NOT starting on a link or button.
    // setPointerCapture redirects all subsequent mouse events (including click)
    // to the capturing element, which prevents <a> href navigation from firing.
    const isInteractable = (event.target as Element).closest('a, button') !== null
    if (!isInteractable) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // setPointerCapture not supported in all environments (e.g. some mobile browsers)
      }
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !containerRef.current) {
      return
    }

    // Only track if left button is held (buttons bitmask 1 = primary)
    if ((event.buttons & 1) === 0) {
      return
    }

    const dx = event.clientX - dragStartXRef.current
    if (!isDraggingRef.current && Math.abs(dx) >= DRAG_THRESHOLD) {
      isDraggingRef.current = true
      dragDidMoveRef.current = true
      setIsDragging(true)
    }

    if (isDraggingRef.current) {
      containerRef.current.scrollLeft = dragStartScrollLeftRef.current - dx
    }
  }

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    isDraggingRef.current = false
    setIsDragging(false)
  }

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    // Suppress link/button clicks that fire after a drag gesture
    if (dragDidMoveRef.current) {
      event.stopPropagation()
      event.preventDefault()
      dragDidMoveRef.current = false
    }
  }

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <button
        type='button'
        onClick={() => scrollByCards(-1)}
        className={cn(
          'absolute top-1/2 left-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition-colors duration-300 ease-out hover:bg-white md:flex',
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
          'absolute top-1/2 right-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcb7af] bg-white/90 text-[#8b5f58] shadow-sm transition-colors duration-300 ease-out hover:bg-white md:flex',
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
            ? 'no-scrollbar flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-[8%] pb-2 select-none [-webkit-overflow-scrolling:touch] sm:px-0'
            : 'no-scrollbar flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 select-none [-webkit-overflow-scrolling:touch]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
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
