'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Petra K.',
    rating: 5,
    text: 'Masáž u Radky byla naprostým zážitkem. Její přístup je velmi profesionální a zároveň osobní. Cítila jsem se naprosto uvolněná a odcházela s pocitem, že mi bylo věnováno maximum péče.',
    date: '15. října 2024',
  },
  {
    name: 'Martin S.',
    rating: 5,
    text: 'Po náročném týdnu jsem potřeboval uvolnit napjaté svaly. Radka má zlaté ruce! Sportovní masáž byla přesně to, co jsem potřeboval. Rozhodně se vrátím.',
    date: '8. října 2024',
  },
  {
    name: 'Jana M.',
    rating: 5,
    text: 'Krásné prostředí, skvělá atmosféra a hlavně úžasná masáž. Radka má opravdu dar a její přístup je velmi empatický. Můžu jen doporučit!',
    date: '2. října 2024',
  },
  {
    name: 'Tomáš V.',
    rating: 5,
    text: 'Lymfatická masáž mi pomohla s otoky nohou. Radka je velmi šikovná a ví, co dělá. Cítím se po masáži jako nový člověk.',
    date: '25. září 2024',
  },
  {
    name: 'Lucie H.',
    rating: 5,
    text: 'Masáž lávovými kameny byla neskutečným zážitkem. Teplo kamenů a Radčiny šikovné ruce dokázaly zázraky. Určitě se vrátím!',
    date: '18. září 2024',
  },
]

// Testimonial Card Component - simplified for Next.js
const TestimonialCard = ({
  testimonial,
  isActive,
}: {
  testimonial: (typeof testimonials)[0]
  isActive: boolean
}) => {
  const cardIndex = testimonials.findIndex((t) => t.name === testimonial.name)
  const rotations = [-1.5, 1.2, -0.8, 1.5, -1.0]
  const rotation = rotations[cardIndex % rotations.length]

  return (
    <div
      className='rounded-xl p-8 md:p-10 flex flex-col items-center transition-all duration-500 relative bg-[#fffef9]'
      style={{
        opacity: isActive ? 1.0 : 0.85,
        transform: `scale(${isActive ? 1 : 0.95}) rotate(${rotation}deg)`,
        zIndex: isActive ? 20 : 10,
        width: '100%',
        height: 'fit-content',
        boxShadow: isActive
          ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(222, 57, 126, 0.08)'
          : '0 12px 28px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div className='flex gap-1 mb-6'>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className='w-5 h-5 fill-[#c4a75f] text-[#c4a75f]' />
        ))}
      </div>

      <p className='text-[#2c2c2c] text-center mb-8 leading-loose text-lg max-w-2xl relative z-10'>
        "{testimonial.text}"
      </p>

      <div className='text-center pt-6 w-full relative border-t border-[#de397e]/15'>
        <p className='text-[#de397e] mb-1' style={{ fontFamily: 'Dancing Script', fontSize: '1.35rem' }}>
          {testimonial.name}
        </p>
        <p className='text-[#888888] text-sm'>{testimonial.date}</p>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  // Create infinite loop - clone first and last 2 cards
  const cloneCount = 2
  const extendedTestimonials = [
    ...testimonials.slice(-cloneCount), // Last 2 cards at start
    ...testimonials, // Original cards
    ...testimonials.slice(0, cloneCount), // First 2 cards at end
  ]

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Handle infinite loop transitions
  useEffect(() => {
    if (currentIndex === testimonials.length) {
      // At end clones, jump to real start
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500)
    } else if (currentIndex === -1) {
      // At start clones, jump to real end
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(testimonials.length - 1)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500)
    }
  }, [currentIndex])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => prev - 1)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => prev + 1)
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrevious()
    }
  }

  return (
    <section
      id='recenze'
      className='py-32 px-6 md:px-16 bg-gradient-to-b from-[#fef8fb] to-white overflow-hidden'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='container mx-auto max-w-6xl'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#de397e] mb-6 tracking-wider'
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Co říkají klienti
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#666666] mb-16 max-w-2xl mx-auto leading-loose'
        >
          Vaše zpětná vazba je pro mě neocenitelná
        </motion.p>

        {/* Carousel Container */}
        <div className='relative'>
          {/* Previous Arrow - desktop only (lg+) */}
          <button
            onClick={goToPrevious}
            className='hidden lg:block absolute left-42 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 cursor-pointer'
            aria-label='Předchozí recenze'
          >
            <ChevronLeft className='w-6 h-6 text-[#de397e]' />
          </button>

          {/* Fade gradient on left edge */}
          <div className='absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#fef8fb] via-[#fef8fb]/60 to-transparent z-10 pointer-events-none hidden md:block' />

          <div
            className='overflow-hidden px-0 sm:px-20 lg:px-52 py-16'
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              animate={{
                x: `calc(-${(currentIndex + cloneCount) * 100}%)`, // Posun započítává klony na začátku
              }}
              transition={
                isTransitioning
                  ? {
                      type: 'spring',
                      stiffness: 200,
                      damping: 35,
                      mass: 1.2,
                    }
                  : {
                      duration: 0,
                    }
              }
              className='flex items-center'
            >
              {extendedTestimonials.map((testimonial, index) => {
                const adjustedCurrentIndex = currentIndex + cloneCount
                const isActive = index === adjustedCurrentIndex
                return (
                  <div key={index} className='flex-shrink-0 flex justify-center' style={{ width: '100%' }}>
                    <div className='w-full max-w-2xl lg:max-w-2xl xl:max-w-3xl px-4'>
                      <TestimonialCard testimonial={testimonial} isActive={isActive} />
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Fade gradient on right edge */}
          <div className='absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none hidden md:block' />

          {/* Next Arrow - desktop only (lg+) */}
          <button
            onClick={goToNext}
            className='hidden lg:block absolute right-42 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 cursor-pointer'
            aria-label='Další recenze'
          >
            <ChevronRight className='w-6 h-6 text-[#de397e]' />
          </button>

          {/* Pagination Dots */}
          <div className='flex justify-center gap-2 mt-12'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? 'w-8 bg-[#de397e]' : 'w-2 bg-[#de397e]/30 hover:bg-[#de397e]/50'
                }`}
                aria-label={`Přejít na recenzi ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
