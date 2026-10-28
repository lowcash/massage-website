'use client'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
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

function GoodToKnow() {
  const { heading, items } = siteContent.calendar.goodToKnow

  return (
    <aside
      aria-labelledby='booking-good-to-know-heading'
      className='border-brand/40 mx-auto w-full max-w-xl border-l-2 pl-5 text-left'
    >
      <p id='booking-good-to-know-heading' className='text-brand text-xs font-medium tracking-[0.22em] uppercase'>
        {applyCzechNbsp(heading)}
      </p>
      <ul className='text-muted-ink mt-3 flex flex-col gap-2.5 text-sm leading-relaxed'>
        {items.map((item) => (
          <li key={item} className='flex gap-2.5'>
            <span aria-hidden='true' className='bg-brand/70 mt-2 h-1 w-1 shrink-0 rounded-full' />
            <span>{applyCzechNbsp(item)}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
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
      <section id='booking' className='bg-surface-alt px-5 py-10 md:px-8 md:py-24'>
        <div className={cn(CONTENT_SHELL, 'flex flex-col gap-10')}>
          <SectionIntro
            id='booking-heading'
            title={siteContent.calendar.heading}
            subtitle={siteContent.calendar.subtitle}
          />

          {selectedService && (
            <div className='border-line text-muted-ink mx-auto w-fit rounded-full border bg-white px-5 py-2 text-base'>
              {applyCzechNbsp(siteContent.calendar.selectedServiceLabel)}:{' '}
              <span className='text-brand-hover font-medium'>{applyCzechNbsp(selectedService)}</span>
            </div>
          )}

          <div className='border-line text-body rounded-2xl border bg-white p-10 text-center'>
            <p className='text-lg'>{applyCzechNbsp(siteContent.calendar.unavailableMessage)}</p>
            <p className='mt-2 text-base'>{applyCzechNbsp(siteContent.calendar.unavailableHelp)}</p>
          </div>

          <GoodToKnow />
        </div>
      </section>
    )
  }

  return (
    <section id='booking' className='bg-surface-alt px-5 py-10 md:px-8 md:py-24'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-6 md:gap-12')}>
        <div ref={intro.ref} className={`${fadeIn} ${!intro.inView ? hidden : ''}`}>
          <SectionIntro
            id='booking-heading'
            title={siteContent.calendar.heading}
            subtitle={siteContent.calendar.subtitle}
            description={siteContent.calendar.intro}
          />
        </div>

        {selectedService && (
          <div className='border-line text-muted-ink mx-auto w-fit rounded-full border bg-white px-5 py-2 text-base'>
            {applyCzechNbsp(siteContent.calendar.selectedServiceLabel)}:{' '}
            <span className='text-brand-hover font-medium'>{applyCzechNbsp(selectedService)}</span>
          </div>
        )}

        <div ref={carousel.ref} className='mx-auto w-full max-w-6xl'>
          <PeekCarousel
            ariaLabel={siteContent.calendar.carouselAriaLabel}
            itemClassName='w-[78%] sm:w-[44%] md:w-[30%] lg:w-[16%]'
            fadeEdges={true}
          >
            {calendarData.map((dayData, dayIndex) => (
              <article
                key={`${dayData.day}-${dayData.date}`}
                className={`${fadeIn} ${!carousel.inView ? hidden : ''} ${
                  dayData.isToday
                    ? 'border-brand-hover bg-paper h-full rounded-2xl border-2 p-3 shadow-[0_8px_26px_rgba(201,123,111,0.18)] md:p-4'
                    : 'border-line h-full rounded-2xl border bg-white p-3 md:p-4'
                }`}
                style={{ transitionDelay: carousel.inView ? `${Math.min(dayIndex, 5) * 90}ms` : '0ms' }}
              >
                <div className='border-line mb-3 border-b pb-3 text-center md:mb-5 md:pb-4'>
                  <h3 className='font-display text-ink text-3xl leading-none lg:text-[1.75rem]'>{dayData.day}</h3>
                  <p className='text-muted-ink mt-2 text-sm tracking-[0.14em] uppercase'>{dayData.date}</p>
                </div>

                <div className='grid grid-cols-2 gap-2 lg:grid-cols-1'>
                  {dayData.slots.map((slot) =>
                    slot.available ? (
                      <a
                        key={slot.time}
                        href={getSlotWhatsAppUrl(dayData.date, slot.time)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='border-brand-hover/40 bg-paper text-body hover:border-brand-hover hover:bg-brand-hover rounded-xl border px-3 py-2.5 text-center text-base transition-colors duration-500 ease-out hover:text-white'
                      >
                        {slot.time}
                      </a>
                    ) : (
                      <span
                        key={slot.time}
                        aria-disabled='true'
                        className='text-muted-ink/45 cursor-not-allowed rounded-xl px-3 py-2.5 text-center text-base line-through decoration-1'
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
          className={`flex flex-col items-center gap-6 text-center ${fadeIn} ${!cta.inView ? hidden : ''}`}
          style={{ transitionDelay: cta.inView ? '200ms' : '0ms' }}
        >
          <p className='text-body text-base leading-relaxed text-balance'>
            {applyCzechNbsp(siteContent.calendar.flexibilityNote)}
          </p>
          <GoodToKnow />
          <a
            href={whatsappCtaUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-brand hover:bg-brand-hover inline-flex rounded-full px-7 py-3.5 text-xs tracking-[0.16em] text-white uppercase transition-colors duration-300 ease-out'
          >
            {applyCzechNbsp(siteContent.calendar.whatsappCta)}
          </a>
        </div>
      </div>
    </section>
  )
}
