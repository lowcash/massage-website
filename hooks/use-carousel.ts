import { useState, useEffect, useRef } from 'react'

interface UseCarouselProps {
  imagesLength: number
  autoplaySpeed: number
  minSwipeDistance?: number
}

export function useCarousel({ 
  imagesLength, 
  autoplaySpeed, 
  minSwipeDistance = 50 
}: UseCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAutoplayPaused) {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % imagesLength)
      }, autoplaySpeed)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoplayPaused, imagesLength, autoplaySpeed])

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? imagesLength - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % imagesLength)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNextSlide()
    } else if (isRightSwipe) {
      goToPrevSlide()
    }
  }

  const handleMouseEnter = () => {
    setIsAutoplayPaused(true)
  }

  const handleMouseLeave = () => {
    setIsAutoplayPaused(false)
  }

  return {
    activeSlide,
    goToSlide,
    goToPrevSlide,
    goToNextSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,
  }
}
