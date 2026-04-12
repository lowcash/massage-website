'use client'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useBooking } from '@/src/contexts/BookingContext'
import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

import type { CalendarSlot } from './Calendar'

interface CalendarDisplaySlot {
  time: string
  available: boolean
}

interface CalendarDisplayDay {
  day: string
  date: string
  slots: CalendarDisplaySlot[]
  isToday: boolean
}

const mapApiDataToDisplay = (apiData?: CalendarSlot[] | unknown): CalendarDisplayDay[] => {
  let slots: CalendarSlot[] = []

  if (!apiData) {
    return []
  }

  if (
    typeof apiData === 'object' &&
    apiData !== null &&
    'data' in apiData &&
    Array.isArray((apiData as { data: CalendarSlot[] }).data)
  ) {
    slots = (apiData as { data: CalendarSlot[] }).data
  } else if (Array.isArray(apiData)) {
    slots = apiData
  } else {
    return []
  }

  if (slots.length === 0) {
    return []
  }

  const days = siteContent.calendar.dayNames

  const today = new Date()
  const todayPrague = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  todayPrague.setHours(0, 0, 0, 0)

  const slotsByDay = new Map<string, CalendarSlot[]>()

  slots.forEach((slot) => {
    const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date)
    const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    const dayKey = `${slotPrague.getFullYear()}-${String(slotPrague.getMonth() + 1).padStart(2, '0')}-${String(slotPrague.getDate()).padStart(2, '0')}`

    if (!slotsByDay.has(dayKey)) {
      slotsByDay.set(dayKey, [])
    }

    slotsByDay.get(dayKey)?.push(slot)
  })

  return Array.from(slotsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([, daySlots]) => {
      const firstSlot = daySlots[0]
      const slotDate = firstSlot.date instanceof Date ? firstSlot.date : new Date(firstSlot.date)
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
      slotPrague.setHours(0, 0, 0, 0)

      return slotPrague >= todayPrague
    })
    .map(([, daySlots]) => {
      const firstSlot = daySlots[0]
      const slotDate = firstSlot.date instanceof Date ? firstSlot.date : new Date(firstSlot.date)
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))

      const dayIndex = slotPrague.getDay()
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]
      const dateStr = `${slotPrague.getDate()}.${slotPrague.getMonth() + 1}.`

      const slotDateOnly = `${slotPrague.getFullYear()}-${String(slotPrague.getMonth() + 1).padStart(2, '0')}-${String(slotPrague.getDate()).padStart(2, '0')}`
      const todayDateOnly = `${todayPrague.getFullYear()}-${String(todayPrague.getMonth() + 1).padStart(2, '0')}-${String(todayPrague.getDate()).padStart(2, '0')}`
      const isToday = todayDateOnly === slotDateOnly

      const dayDisplaySlots = daySlots
        .map((slot) => {
          const time = slot.date instanceof Date ? slot.date : new Date(slot.date)
          const timePrague = new Date(time.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
          const timeStr = `${String(timePrague.getHours()).padStart(2, '0')}:${String(timePrague.getMinutes()).padStart(2, '0')}`

          return {
            time: timeStr,
            available: !slot.reserved,
          }
        })
        .sort((a, b) => {
          const [aHours, aMinutes] = a.time.split(':').map(Number)
          const [bHours, bMinutes] = b.time.split(':').map(Number)

          if (aHours !== bHours) {
            return aHours - bHours
          }

          return aMinutes - bMinutes
        })

      return {
        day: dayName,
        date: dateStr,
        slots: dayDisplaySlots,
        isToday,
      }
    })
}

interface BookingCalendarProps {
  data?: CalendarSlot[]
}

export default function BookingCalendar({ data }: BookingCalendarProps) {
  const shouldReduceMotion = useReducedMotion()
  const { selectedService } = useBooking()
  const intro = useInView()
  const carousel = useInView()
  const cta = useInView()

  const fadeIn = 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  const hidden = shouldReduceMotion ? '' : 'opacity-0 translate-y-4'

  const calendarData = mapApiDataToDisplay(data)
  const whatsappCtaMessage = selectedService
    ? siteContent.floatingButtons.whatsappSelectedServiceMessage.replace('{service}', selectedService)
    : siteContent.floatingButtons.whatsappDefaultMessage
  const whatsappCtaUrl = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(whatsappCtaMessage)}`

  const getSlotWhatsAppUrl = (date: string, time: string) => {
    let message = siteContent.calendar.whatsappDefaultTemplate.replace('{date}', date).replace('{time}', time)

    if (selectedService) {
      message = siteContent.calendar.whatsappServiceTemplate
        .replace('{service}', selectedService)
        .replace('{date}', date)
        .replace('{time}', time)
    }

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  if (calendarData.length === 0) {
    return (
      <section id='booking' className='bg-[#f1e3df] px-5 py-16 md:px-8 md:py-24'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-10'>
          <SectionIntro
            id='booking-heading'
            title={siteContent.calendar.heading}
            subtitle={siteContent.calendar.subtitle}
          />

          {selectedService && (
            <div className='mx-auto w-fit rounded-full border border-[#dab6af] bg-white px-5 py-2 text-[15px] text-[#805d57]'>
              {applyCzechNbsp(siteContent.calendar.selectedServiceLabel)}:{' '}
              <span className='font-medium text-[#be675a]'>{applyCzechNbsp(selectedService)}</span>
            </div>
          )}

          <div className='rounded-2xl border border-[#e2c8c3] bg-white p-10 text-center text-[#6a5752]'>
            <p className='text-lg'>{applyCzechNbsp(siteContent.calendar.unavailableMessage)}</p>
            <p className='mt-2 text-[15px]'>{applyCzechNbsp(siteContent.calendar.unavailableHelp)}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='booking' className='bg-[#f1e3df] px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-12'>
        <div ref={intro.ref} className={`${fadeIn} ${!intro.inView ? hidden : ''}`}>
          <SectionIntro
            id='booking-heading'
            title={siteContent.calendar.heading}
            subtitle={siteContent.calendar.subtitle}
            description={siteContent.calendar.intro}
          />
        </div>

        {selectedService && (
          <div className='mx-auto w-fit rounded-full border border-[#dab6af] bg-white px-5 py-2 text-[15px] text-[#805d57]'>
            {applyCzechNbsp(siteContent.calendar.selectedServiceLabel)}:{' '}
            <span className='font-medium text-[#be675a]'>{applyCzechNbsp(selectedService)}</span>
          </div>
        )}

        <div
          ref={carousel.ref}
          className={`mx-auto w-full max-w-6xl ${fadeIn} ${!carousel.inView ? hidden : ''}`}
          style={{ transitionDelay: carousel.inView ? '140ms' : '0ms' }}
        >
          <PeekCarousel
            ariaLabel={siteContent.calendar.carouselAriaLabel}
            itemClassName='w-[84%] sm:w-[46%] md:w-[32%] lg:w-[19%]'
            fadeEdges={true}
            fadeColor='rgb(241 227 223)'
          >
            {calendarData.map((dayData) => (
              <article
                key={`${dayData.day}-${dayData.date}`}
                className={
                  dayData.isToday
                    ? 'h-full rounded-xl border-2 border-[#c97b6f] bg-[#fff7f5] p-4 shadow-[0_8px_26px_rgba(201,123,111,0.18)]'
                    : 'h-full rounded-xl border border-[#e0c7c1] bg-white p-4'
                }
              >
                <div className='mb-5 border-b border-[#ecd9d5] pb-4 text-center'>
                  <h3
                    className='text-3xl leading-none text-[#412f2b] lg:text-[2rem]'
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {dayData.day}
                  </h3>
                  <p className='mt-2 text-sm tracking-[0.14em] text-[#8a6963] uppercase'>{dayData.date}</p>
                </div>

                <div className='flex flex-col gap-2'>
                  {dayData.slots.map((slot) =>
                    slot.available ? (
                      <a
                        key={slot.time}
                        href={getSlotWhatsAppUrl(dayData.date, slot.time)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full border border-[#c97b6f] bg-white px-4 py-2 text-center text-[15px] text-[#5f4540] transition-colors duration-300 ease-out hover:bg-[#c97b6f] hover:text-white'
                      >
                        {slot.time}
                      </a>
                    ) : (
                      <span
                        key={slot.time}
                        aria-disabled='true'
                        className='cursor-not-allowed rounded-full border border-[#dadada] bg-[#ececec] px-4 py-2 text-center text-[15px] text-[#9f9f9f] line-through'
                      >
                        {slot.time}
                      </span>
                    ),
                  )}
                </div>
              </article>
            ))}
          </PeekCarousel>
        </div>

        <div
          ref={cta.ref}
          className={`flex flex-col items-center gap-4 text-center ${fadeIn} ${!cta.inView ? hidden : ''}`}
          style={{ transitionDelay: cta.inView ? '200ms' : '0ms' }}
        >
          <p className='text-[15px] leading-relaxed text-[#6f5b56]'>
            {applyCzechNbsp(siteContent.calendar.flexibilityNote)}
          </p>
          <a
            href={whatsappCtaUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex rounded-md bg-[#ca6f61] px-6 py-3 text-xs tracking-[0.16em] text-white uppercase transition-colors duration-300 ease-out hover:bg-[#b45c4f]'
          >
            {applyCzechNbsp(siteContent.calendar.whatsappCta)}
          </a>
        </div>
      </div>
    </section>
  )
}
