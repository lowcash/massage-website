'use client'

import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIsClient } from '@/hooks/use-is-cllient'
import { useBooking } from '@/contexts/BookingContext'

const VISIBLE_DESKTOP_DAYS = 3
const VISIBLE_MOBILE_DAYS = 1

export interface CalendarSlot {
  date: Date
  reserved: boolean
}

interface Props {
  data: CalendarSlot[]
}

export default function Calendar(p: Props) {
  const [currentPageDesktop, setCurrentPageDesktop] = useState(0)
  const [currentPageMobile, setCurrentPageMobile] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const isMobile = useIsMobile()
  const isClient = useIsClient()
  const { selectedService } = useBooking()

  const data = useMemo(() => {
    if (!isClient) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return p.data.filter((x) => x.date > today)
  }, [isClient, p.data])

  // Skupiny slotů podle dne
  const groupedDays = groupSlotsByDay(data)
  const visibleDays = isMobile ? VISIBLE_MOBILE_DAYS : VISIBLE_DESKTOP_DAYS
  const cardsPerPage = visibleDays
  const totalPagesDesktop = Math.ceil(groupedDays.length / VISIBLE_DESKTOP_DAYS)
  const totalPagesMobile = groupedDays.length

  // Center on today's date on mount
  useEffect(() => {
    if (!isClient) return
    
    const todayIndex = groupedDays.findIndex(dayGroup => isToday(dayGroup.day))
    if (todayIndex !== -1) {
      setCurrentPageDesktop(Math.floor(todayIndex / VISIBLE_DESKTOP_DAYS))
      setCurrentPageMobile(todayIndex)
    }
  }, [isClient, groupedDays])

  const minSwipeDistance = 50

  const handleSlotClick = (date: Date, slot: CalendarSlot) => {
    if (slot.reserved) return
    
    // Redirect to contact section
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Touch handlers - desktop
  const onTouchStartDesktop = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMoveDesktop = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEndDesktop = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && currentPageDesktop < totalPagesDesktop - 1) {
      setCurrentPageDesktop(prev => prev + 1)
    }
    if (isRightSwipe && currentPageDesktop > 0) {
      setCurrentPageDesktop(prev => prev - 1)
    }
  }

  // Touch handlers - mobile
  const onTouchStartMobile = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMoveMobile = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEndMobile = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && currentPageMobile < totalPagesMobile - 1) {
      setCurrentPageMobile(prev => prev + 1)
    }
    if (isRightSwipe && currentPageMobile > 0) {
      setCurrentPageMobile(prev => prev - 1)
    }
  }

  return (
    <section id='booking' className='py-32 px-6 md:px-16 bg-gradient-to-b from-white to-[#fef8fb]'>
      <div className='container mx-auto max-w-4xl'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#de397e] mb-6 tracking-wider'
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Volné termíny
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#666666] mb-6 max-w-2xl mx-auto leading-loose'
        >
          Vyberte si termín, který vám vyhovuje, a rezervujte si masáž přes WhatsApp
        </motion.p>

        {/* Selected Service Badge */}
        {/* {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex justify-center mb-10'
          >
            <div className='inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-6 py-3 bg-gradient-to-r from-[#de397e] to-[#c4a75f] text-white rounded-full shadow-lg text-center'>
              <span style={{ fontFamily: 'Dancing Script', fontSize: '1.2rem' }}>
                Vybraná služba:
              </span>
              <span className='font-medium'>{selectedService}</span>
            </div>
          </motion.div>
        )} */}

        {/* Carousel Container */}
        <div className='relative'>
          {/* Desktop Version: 3 cards per page - šipky jen na desktop (lg+) */}
          <div className='hidden md:block relative'>
            {/* Previous Arrow - desktop only */}
            <button
              onClick={() => setCurrentPageDesktop(prev => Math.max(0, prev - 1))}
              disabled={currentPageDesktop === 0}
              className={`hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 ${
                currentPageDesktop === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label='Předchozí termíny'
            >
              <ChevronLeft className={`w-6 h-6 ${currentPageDesktop === 0 ? 'text-gray-400' : 'text-[#de397e]'}`} />
            </button>

            {/* Fade gradient on left edge - only if there are previous pages */}
            {currentPageDesktop > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none" />
            )}

            <div className='overflow-hidden px-20 md:px-24'>
              <motion.div
                animate={{ 
                  x: `${-currentPageDesktop * 100}%`
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 35,
                  mass: 1.2
                }}
                className='flex'
                onTouchStart={onTouchStartDesktop}
                onTouchMove={onTouchMoveDesktop}
                onTouchEnd={onTouchEndDesktop}
              >
                {Array.from({ length: totalPagesDesktop }).map((_, pageIndex) => (
                  <div 
                    key={pageIndex}
                    className='w-full flex-shrink-0 flex gap-6'
                  >
                    {groupedDays
                      .slice(pageIndex * VISIBLE_DESKTOP_DAYS, (pageIndex + 1) * VISIBLE_DESKTOP_DAYS)
                      .map((dayGroup, cardIndex) => {
                        const globalIndex = pageIndex * VISIBLE_DESKTOP_DAYS + cardIndex
                        const isCurrentPage = pageIndex === currentPageDesktop
                        return (
                          <div
                            key={globalIndex}
                            className='flex-1'
                          >
                            <div
                              className={`rounded-3xl p-6 w-full transition-all duration-500 ${
                                isToday(dayGroup.day)
                                  ? "bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] border-2 border-[#de397e]/30 shadow-lg shadow-[#de397e]/10"
                                  : "bg-white/70 backdrop-blur-[16px] border border-white/50"
                              } ${!isCurrentPage ? "opacity-50" : ""}`}
                            >
                              {/* Day header - centered */}
                              <div className="text-center mb-6 pb-5 border-b border-[#de397e]/20">
                                <h3
                                  className={
                                    isToday(dayGroup.day)
                                      ? "text-[#de397e] mb-2"
                                      : "text-[#2c2c2c] mb-2"
                                  }
                                  style={{
                                    fontFamily:
                                      "Dancing Script",
                                    fontSize: "2rem",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {formatDay(dayGroup.day)}
                                </h3>
                                <p
                                  className="text-[#666666]"
                                  style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {formatDateShort(dayGroup.day)}
                                </p>
                              </div>

                              {/* Time slots */}
                              <div className='space-y-3'>
                                {dayGroup.slots.length > 0 ? (
                                  dayGroup.slots.map((slot, slotIndex) => (
                                    <button
                                      key={slotIndex}
                                      onClick={() => isCurrentPage && handleSlotClick(dayGroup.day, slot)}
                                      disabled={slot.reserved || !isCurrentPage}
                                      className={`w-full px-4 py-3 rounded-2xl text-center transition-all duration-300 ${
                                        !slot.reserved && isCurrentPage
                                          ? 'bg-white/60 backdrop-blur-sm text-[#2c2c2c] border border-white/50 hover:bg-[#de397e] hover:text-white hover:border-[#de397e] hover:scale-[1.02] hover:shadow-md cursor-pointer'
                                          : 'bg-[#e8e8e8] text-[#999999] cursor-not-allowed line-through'
                                      }`}
                                    >
                                      {formatTime(slot.date)}
                                    </button>
                                  ))
                                ) : (
                                  <div className='py-4 text-center text-sm text-gray-400'>Žádné volné termíny</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Fade gradient on right edge - only if there are next pages */}
            {currentPageDesktop < totalPagesDesktop - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none" />
            )}

            {/* Next Arrow - desktop only */}
            <button
              onClick={() => setCurrentPageDesktop(prev => Math.min(totalPagesDesktop - 1, prev + 1))}
              disabled={currentPageDesktop >= totalPagesDesktop - 1}
              className={`hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 ${
                currentPageDesktop >= totalPagesDesktop - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label='Další termíny'
            >
              <ChevronRight className={`w-6 h-6 ${currentPageDesktop >= totalPagesDesktop - 1 ? 'text-gray-400' : 'text-[#de397e]'}`} />
            </button>

            {/* Progress Dots - Only 7 dots for 7 pages */}
            <div className='flex justify-center gap-3 mt-12'>
              {Array.from({ length: totalPagesDesktop }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPageDesktop(index)}
                  className={`transition-all rounded-full cursor-pointer ${
                    index === currentPageDesktop
                      ? 'bg-[#de397e] w-8 h-3'
                      : 'bg-[#de397e]/30 w-3 h-3 hover:bg-[#de397e]/60'
                  }`}
                  aria-label={`Přejít na týden ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Version: 1 card per page */}
          <div className='md:hidden relative'>
            {/* Fade gradient on left edge - mobile - only if not first page */}
            {currentPageMobile > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 via-white/20 to-transparent z-10 pointer-events-none" />
            )}

            <div className='overflow-hidden'>
              <motion.div
                animate={{
                  x: `calc(17.5% - ${currentPageMobile * 65}%)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 35,
                  mass: 1.2,
                }}
                className="flex"
                onTouchStart={onTouchStartMobile}
                onTouchMove={onTouchMoveMobile}
                onTouchEnd={onTouchEndMobile}
              >
                {groupedDays.map((dayGroup, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[65%]"
                  >
                    <div className="px-0 h-full">
                      <div
                        className={`rounded-3xl px-4 py-6 w-full max-w-[320px] mx-auto transition-all duration-500 ${
                          isToday(dayGroup.day)
                            ? "bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] border-2 border-[#de397e]/30 shadow-lg shadow-[#de397e]/10"
                            : "bg-white/70 backdrop-blur-[16px] border border-white/50"
                        } ${index !== currentPageMobile ? "opacity-40 scale-95" : "opacity-100"}`}
                      >
                        <div className='text-center mb-6 pb-5 border-b border-[#de397e]/20'>
                          <h3
                            className={
                              isToday(dayGroup.day)
                                ? "text-[#de397e] mb-2"
                                : "text-[#2c2c2c] mb-2"
                            }
                            style={{
                              fontFamily: "Dancing Script",
                              fontSize: "2rem",
                              lineHeight: "1.2",
                            }}
                          >
                            {formatDay(dayGroup.day)}
                          </h3>
                          <p
                            className="text-[#666666]"
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: 500,
                            }}
                          >
                            {formatDateShort(dayGroup.day)}
                          </p>
                        </div>

                        <div className='space-y-3'>
                          {dayGroup.slots.length > 0 ? (
                            dayGroup.slots.map((slot, slotIndex) => (
                              <button
                                key={slotIndex}
                                onClick={() => index === currentPageMobile && handleSlotClick(dayGroup.day, slot)}
                                disabled={slot.reserved || index !== currentPageMobile}
                                className={`w-full px-4 py-3 rounded-2xl text-center transition-all duration-300 ${
                                  !slot.reserved && index === currentPageMobile
                                    ? 'bg-[#f5f0ea] text-[#2c2c2c] hover:bg-[#de397e] hover:text-white hover:scale-[1.02] hover:shadow-md cursor-pointer'
                                    : 'bg-[#e8e8e8] text-[#999999] cursor-not-allowed line-through'
                                }`}
                              >
                                {formatTime(slot.date)}
                              </button>
                            ))
                          ) : (
                            <div className='py-4 text-center text-sm text-gray-400'>Žádné volné termíny</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Fade gradient on right edge - mobile - only if not last page */}
            {currentPageMobile < totalPagesMobile - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 via-white/20 to-transparent z-10 pointer-events-none" />
            )}

            {/* Progress Dots - Mobile: Show weeks (7 dots for 21 days = 3 days per dot) */}
            <div className='flex justify-center gap-3 mt-12'>
              {Array.from({ length: 7 }).map((_, weekIndex) => {
                const weekStartDay = weekIndex * 3
                const weekEndDay = weekStartDay + 2
                const isCurrentWeek = currentPageMobile >= weekStartDay && currentPageMobile <= weekEndDay
                
                return (
                  <button
                    key={weekIndex}
                    onClick={() => setCurrentPageMobile(weekStartDay)}
                    className={`transition-all rounded-full cursor-pointer ${
                      isCurrentWeek
                        ? 'bg-[#de397e] w-8 h-3'
                        : 'bg-[#de397e]/30 w-3 h-3 hover:bg-[#de397e]/60'
                    }`}
                    aria-label={`Přejít na týden ${weekIndex + 1}`}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='text-center mt-16'
        >
          {!selectedService ? (
            <>
              <p className='text-[#666666] mb-6 leading-loose'>
                Pro rezervaci termínu nejprve vyberte službu výše
              </p>
              <motion.a
                href='#services'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className='inline-flex items-center gap-3 px-8 py-3 bg-[#de397e] text-white rounded-full transition-all duration-300 hover:bg-[#c4a75f] hover:shadow-xl cursor-pointer'
              >
                <span style={{ fontFamily: 'Dancing Script', fontSize: '1.25rem' }}>
                  Vybrat službu
                </span>
              </motion.a>
            </>
          ) : (
            <>
              <p className='text-[#666666] mb-6 leading-loose'>
                Nenašli jste vhodný termín? Kontaktujte mě a domluvíme se.
              </p>
              <motion.a
                href='https://wa.me/420605579643'
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className='inline-flex items-center gap-3 px-8 py-3 bg-[#de397e] text-white rounded-full transition-all duration-300 hover:bg-[#c4a75f] hover:shadow-xl cursor-pointer'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/>
                </svg>
                <span style={{ fontFamily: 'Dancing Script', fontSize: '1.25rem' }}>
                  Napište mi na WhatsApp
                </span>
              </motion.a>
            </>
          )}
        </motion.div>

        <div className='mx-auto mt-8 flex max-w-2xl flex-col gap-1 text-center'>
          <p className='text-gray-600 italic text-sm'>
            Kalendář slouží pouze pro informaci, rezervace je platná až po osobním potvrzení telefonem.
          </p>

          <p className='text-gray-500 text-sm'>
            Termíny aktualizuji manuálně – děkuji za pochopení a trpělivost!
          </p>
        </div>
      </div>
    </section>
  )
}

// Pomocné funkce
function formatDay(date: Date) {
  return isToday(date) ? 'Dnes' : isTomorrow(date) ? 'Zítra' : date.toLocaleDateString('cs-CZ', { weekday: 'long' })
}

function formatDateShort(date: Date) {
  const day = date.getDate()
  const shortMonths = [
    'led', 'úno', 'bře', 'dub', 'kvě', 'čvn',
    'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'
  ]
  const month = shortMonths[date.getMonth()]
  return `${day}. ${month}`
}

function formatDateForWhatsApp(date: Date) {
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isTomorrow(date: Date) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  )
}

function groupSlotsByDay(slots: CalendarSlot[]) {
  const map = new Map<string, CalendarSlot[]>()
  slots.forEach((slot) => {
    const yyyy = slot.date.getFullYear()
    const mm = String(slot.date.getMonth() + 1).padStart(2, '0')
    const dd = String(slot.date.getDate()).padStart(2, '0')
    const dayKey = `${yyyy}-${mm}-${dd}`

    if (!map.has(dayKey)) map.set(dayKey, [])
    map.get(dayKey)!.push(slot)
  })
  return Array.from(map.entries()).map(([dayKey, slots]) => ({
    day: slots[0].date,
    slots,
  }))
}
