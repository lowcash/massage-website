'use client'

import { siteContent } from '@/lib/content'
import { mapApiDataToDisplay } from '@/lib/prague-time'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useBooking } from '@/src/contexts/BookingContext'

import type { CalendarSlot } from './Calendar'

function GoodToKnow() {
  const { heading, items } = siteContent.calendar.goodToKnow

  return (
    <aside aria-labelledby='booking-good-to-know-heading' className='grid content-start gap-[var(--spacing-s2)]'>
      <h3 id='booking-good-to-know-heading' className='text-night-ink text-[length:var(--text-fluid-2)]'>
        {applyCzechNbsp(heading)}
      </h3>
      <ul className='m-0 grid list-none gap-3.5 p-0 text-[length:var(--text-fluid--1)]'>
        {items.map((item) => (
          <li key={item} className='grid grid-cols-[auto_1fr] gap-x-3'>
            <span aria-hidden='true' className='bg-glow mt-[0.6em] h-[0.45rem] w-[0.45rem] rounded-full' />
            <span>{applyCzechNbsp(item)}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function SelectedService({ name }: { name: string }) {
  return (
    <div className='bg-night-ink/7 text-night-ink rounded-(--radius-md) px-[1.1rem] py-3.5 [view-transition-name:selected-service]'>
      <small className='text-night-muted block text-[0.6875rem] font-semibold tracking-[0.12em] uppercase'>
        {applyCzechNbsp(siteContent.calendar.selectedServiceLabel)}
      </small>
      <span className='font-display text-[length:var(--text-fluid-1)] font-medium [font-variation-settings:"SOFT"_80,"opsz"_36]'>
        {applyCzechNbsp(name)}
      </span>
    </div>
  )
}

const SECTION_CLASS =
  'night focus-night bg-night text-night-muted relative isolate overflow-hidden py-[var(--spacing-s6)]'
const GLOW_CLASS =
  'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_28rem_at_85%_-10%,color-mix(in_oklab,var(--color-glow)_16%,transparent),transparent_70%)]'
const PANEL_CLASS =
  'bg-[color-mix(in_oklab,var(--color-night-ink)_5%,var(--color-night))] border border-night-ink/12 rounded-(--radius-lg) p-[clamp(1.25rem,0.6rem+2.6vw,3rem)]'

interface BookingCalendarProps {
  data?: CalendarSlot[]
}

export default function BookingCalendar({ data }: BookingCalendarProps) {
  const { selectedService } = useBooking()

  const calendarData = mapApiDataToDisplay(data, siteContent.calendar.dayNames)
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
      <section id='booking' aria-labelledby='booking-heading' className={SECTION_CLASS}>
        <div aria-hidden='true' className={GLOW_CLASS} />
        <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s4)]')}>
          <SectionIntro
            id='booking-heading'
            title={siteContent.calendar.heading}
            subtitle={siteContent.calendar.subtitle}
            onNight
          />

          <div
            className={cn(PANEL_CLASS, 'reveal-soft grid gap-[var(--spacing-s4)] min-[62rem]:grid-cols-[1.5fr_1fr]')}
          >
            <div className='grid content-start gap-[var(--spacing-s2)]'>
              {selectedService && <SelectedService name={selectedService} />}
              <p className='text-night-ink text-[length:var(--text-fluid-1)]'>
                {applyCzechNbsp(siteContent.calendar.unavailableMessage)}
              </p>
              <p>{applyCzechNbsp(siteContent.calendar.unavailableHelp)}</p>
            </div>
            <GoodToKnow />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='booking' aria-labelledby='booking-heading' className={SECTION_CLASS}>
      <div aria-hidden='true' className={GLOW_CLASS} />
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s4)]')}>
        <SectionIntro
          id='booking-heading'
          title={siteContent.calendar.heading}
          subtitle={siteContent.calendar.subtitle}
          description={siteContent.calendar.intro}
          onNight
        />

        <div
          className={cn(
            PANEL_CLASS,
            'reveal-soft grid gap-[var(--spacing-s4)] min-[62rem]:grid-cols-[1.5fr_1fr] min-[62rem]:gap-[var(--spacing-s5)]',
          )}
        >
          <div className='grid min-w-0 content-start gap-[var(--spacing-s3)]'>
            {selectedService && <SelectedService name={selectedService} />}

            <PeekCarousel
              ariaLabel={siteContent.calendar.carouselAriaLabel}
              itemClassName='w-[78%] sm:w-[44%] md:w-[30%] lg:w-[46%] xl:w-[31%]'
              fadeEdges={true}
            >
              {calendarData.map((dayData) => (
                <article
                  key={`${dayData.day}-${dayData.date}`}
                  className={cn(
                    'h-full rounded-(--radius-md) border p-3 md:p-4',
                    dayData.isToday ? 'border-glow bg-night-ink/8' : 'border-night-ink/12 bg-night-ink/4',
                  )}
                >
                  <div className='border-night-ink/12 mb-3 border-b pb-3 md:mb-4'>
                    <h3 className='text-night-ink font-sans text-[length:var(--text-fluid-0)] leading-tight font-semibold [font-variation-settings:normal]'>
                      {dayData.day}
                    </h3>
                    <p className='text-night-muted text-[length:var(--text-fluid--1)]'>{dayData.date}</p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {dayData.slots.map((slot) =>
                      slot.available ? (
                        <a
                          key={slot.time}
                          href={getSlotWhatsAppUrl(dayData.date, slot.time)}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='slot-lift border-night-ink/28 text-night-ink hover:border-glow hover:bg-glow hover:text-night inline-flex min-h-11 min-w-[4.5rem] items-center justify-center rounded-full border px-4 text-[length:var(--text-fluid--1)] leading-none font-medium tabular-nums transition-[background-color,color,border-color,transform] duration-260 ease-(--ease-out) hover:-translate-y-px'
                        >
                          {slot.time}
                        </a>
                      ) : (
                        <span
                          key={slot.time}
                          aria-disabled='true'
                          className='text-slot-unavailable inline-flex min-h-11 min-w-[4.5rem] cursor-not-allowed items-center justify-center rounded-full px-4 text-[length:var(--text-fluid--1)] leading-none line-through decoration-1'
                        >
                          {slot.time}
                          <span className='sr-only'> obsazeno</span>
                        </span>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </PeekCarousel>
          </div>

          <div className='grid content-start gap-[var(--spacing-s3)]'>
            <GoodToKnow />
            <div className='grid justify-items-start gap-[var(--spacing-s2)]'>
              <p className='max-w-[34ch] text-[length:var(--text-fluid--1)]'>
                {applyCzechNbsp(siteContent.calendar.flexibilityNote)}
              </p>
              <a
                href={whatsappCtaUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-lift bg-glow text-night inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-[0.8125rem] leading-none font-semibold tracking-[0.14em] uppercase transition-[background-color,transform] duration-260 ease-(--ease-soft) hover:bg-[color-mix(in_oklab,var(--color-glow)_85%,white)] active:scale-[0.98]'
              >
                {applyCzechNbsp(siteContent.calendar.whatsappCta)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
