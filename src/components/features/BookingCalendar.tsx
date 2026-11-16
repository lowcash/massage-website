'use client'

import { useEffect, useRef, useState } from 'react'

import { Check, ChevronDown } from 'lucide-react'

import {
  type BookingDay,
  addMinutesToTime,
  buildBookingDays,
  formatDayLong,
  formatDayShort,
  monthKeyOf,
  parseDurationMinutes,
  pluralFreeSlots,
} from '@/lib/booking-days'
import { siteContent } from '@/lib/content'
import { pragueDayKey } from '@/lib/prague-time'
import { applyCzechNbsp, cn } from '@/lib/utils'

import MonthGrid from '@/src/components/features/booking/MonthGrid'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { PRIMARY_BUTTON } from '@/src/components/shared/button-styles'
import { useBooking } from '@/src/contexts/BookingContext'

import type { CalendarSlot } from './Calendar'

const copy = siteContent.calendar

function GoodToKnow() {
  const { heading, items } = copy.goodToKnow

  return (
    <aside aria-labelledby='booking-good-to-know-heading' className='grid content-start gap-[var(--spacing-s2)]'>
      <h3 id='booking-good-to-know-heading' className='text-ink text-[length:var(--text-fluid-1)]'>
        {applyCzechNbsp(heading)}
      </h3>
      <ul className='text-body m-0 grid list-none gap-3 p-0 text-[length:var(--text-fluid--1)] md:grid-cols-3 md:gap-[var(--spacing-s3)]'>
        {items.map((item) => (
          <li key={item} className='grid grid-cols-[auto_1fr] gap-x-3'>
            <span aria-hidden='true' className='bg-sage mt-[0.62em] h-[0.3rem] w-[0.3rem] rounded-full' />
            <span>{applyCzechNbsp(item)}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

type StepState = 'done' | 'active' | 'pending'

function StepLabel({ no, children, id, state }: { no: number; children: string; id?: string; state: StepState }) {
  return (
    <p
      id={id}
      className={cn(
        'mb-3 flex items-center gap-2.5 text-[0.8125rem] font-medium tracking-[0.12em] uppercase',
        state === 'pending' ? 'text-muted-ink' : 'text-ink',
      )}
    >
      <span
        aria-hidden='true'
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full border text-xs tabular-nums',
          state === 'done' && 'border-brand bg-brand text-on-brand',
          state === 'active' && 'border-brand text-brand',
          state === 'pending' && 'border-line text-muted-ink',
        )}
      >
        {state === 'done' ? <Check className='h-3.5 w-3.5' strokeWidth={3} /> : no}
      </span>
      {children}
    </p>
  )
}

const FIELD =
  'w-full appearance-none rounded-(--radius-md) border border-[color-mix(in_oklab,var(--color-ink)_30%,transparent)] bg-surface px-4 py-3 pr-11 text-ink text-[length:var(--text-fluid-0)] leading-snug transition-colors duration-260 ease-(--ease-soft) hover:border-ink/60'

function ServiceSelect() {
  const { selectedService, setSelectedService } = useBooking()
  const { groups, items } = siteContent.services

  return (
    <div>
      <StepLabel no={1} id='booking-service-label' state={selectedService ? 'done' : 'active'}>
        {copy.steps.service}
      </StepLabel>
      <div className='relative'>
        <select
          aria-labelledby='booking-service-label'
          aria-describedby='booking-service-hint'
          value={selectedService ?? ''}
          onChange={(event) => setSelectedService(event.target.value || null)}
          className={FIELD}
        >
          <option value=''>{copy.serviceNone}</option>
          {groups.map((group) => (
            <optgroup key={group.id} label={group.title}>
              {items
                .filter((item) => item.category === group.id)
                .map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.duration ? `${item.name} · ${item.duration}` : item.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown
          aria-hidden='true'
          className='text-muted-ink pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2'
        />
      </div>
      <p id='booking-service-hint' className='text-muted-ink mt-2 text-[length:var(--text-fluid--1)]'>
        {copy.serviceOptional}
      </p>
    </div>
  )
}

interface BookingCalendarProps {
  data?: CalendarSlot[]
  /** Server-rendered "now" (ISO). Keeps the first client render identical to the HTML, then the clock takes over. */
  generatedAt?: string
  /** Preview mode: data is generated and booking is simulated in memory (lib/demo-calendar.ts). */
  demo?: boolean
}

export default function BookingCalendar({ data, generatedAt, demo = false }: BookingCalendarProps) {
  const { selectedService } = useBooking()
  const [now, setNow] = useState(() => (generatedAt ? new Date(generatedAt) : new Date()))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [monthOverride, setMonthOverride] = useState<string | null>(null)
  const [simulated, setSimulated] = useState<ReadonlySet<string>>(new Set())
  const [demoDone, setDemoDone] = useState(false)
  const timesRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  const todayKey = pragueDayKey(now)
  const days = buildBookingDays(data, now).map((day): BookingDay => {
    if (simulated.size === 0) return day
    const slots = day.slots.map((slot) =>
      simulated.has(`${day.key}T${slot.time}`) ? { ...slot, available: false } : slot,
    )
    return { ...day, slots, freeCount: slots.filter((slot) => slot.available).length }
  })
  const dayMap = new Map(days.map((day) => [day.key, day]))

  const service = siteContent.services.items.find((item) => item.name === selectedService) ?? null
  const durationMinutes = service ? parseDurationMinutes(service.duration) : null

  const whatsappCtaMessage = selectedService
    ? siteContent.floatingButtons.whatsappSelectedServiceMessage.replace('{service}', selectedService)
    : siteContent.floatingButtons.whatsappDefaultMessage
  const whatsappCtaUrl = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(whatsappCtaMessage)}`

  const getSlotWhatsAppUrl = (dayKey: string, time: string) => {
    const date = formatDayShort(dayKey)
    const message = selectedService
      ? copy.whatsappServiceTemplate
          .replace('{service}', selectedService)
          .replace('{date}', date)
          .replace('{time}', time)
      : copy.whatsappDefaultTemplate.replace('{date}', date).replace('{time}', time)

    return `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(message)}`
  }

  if (days.length === 0) {
    return (
      <section id='booking' aria-labelledby='booking-heading' className='py-[var(--spacing-s6)]'>
        <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s4)]')}>
          <SectionIntro id='booking-heading' title={copy.heading} subtitle={copy.subtitle} />

          <div className='bg-paper border-line reveal-soft grid gap-[var(--spacing-s4)] rounded-(--radius-lg) border p-[clamp(1.25rem,0.6rem+2.6vw,3rem)] min-[62rem]:grid-cols-[1.2fr_1fr]'>
            <div className='grid content-start gap-[var(--spacing-s2)]'>
              <ServiceSelect />
              <p className='text-ink text-[length:var(--text-fluid-1)]'>{applyCzechNbsp(copy.unavailableMessage)}</p>
              <p>{applyCzechNbsp(copy.unavailableHelp)}</p>
              <a
                href={whatsappCtaUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(PRIMARY_BUTTON, 'justify-self-start')}
              >
                {applyCzechNbsp(copy.whatsappCta)}
              </a>
            </div>
            <GoodToKnow />
          </div>
        </div>
      </section>
    )
  }

  const firstDay = days[0].key
  const lastDay = days[days.length - 1].key
  const minMonth = monthKeyOf(todayKey < firstDay ? todayKey : firstDay)
  const maxMonth = monthKeyOf(lastDay)
  const month = monthOverride ?? monthKeyOf(firstFreeDay(days)?.key ?? firstDay)

  const nextFree = firstFreeDay(days)
  const nextFreeTime = nextFree?.slots.find((slot) => slot.available)?.time

  const activeDay = selectedDay ? (dayMap.get(selectedDay) ?? null) : null
  const activeSlotValid = Boolean(
    activeDay && selectedTime && activeDay.slots.some((slot) => slot.time === selectedTime && slot.available),
  )
  const time = activeSlotValid ? selectedTime : null

  const chooseDay = (key: string) => {
    setSelectedDay(key)
    setSelectedTime(null)
    setDemoDone(false)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Wait a frame so the slot panel has rendered before it is brought into view (mobile: it sits below the grid).
    requestAnimationFrame(() =>
      timesRef.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }),
    )
  }

  // One-handed on a phone the summary and CTA sit below the slot list: bring them into view once a time is picked.
  const revealSummary = () => {
    if (!window.matchMedia('(max-width: 61.99rem)').matches) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() =>
      summaryRef.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }),
    )
  }

  const chooseNextFree = () => {
    if (!nextFree || !nextFreeTime) return
    setMonthOverride(monthKeyOf(nextFree.key))
    setSelectedDay(nextFree.key)
    setSelectedTime(nextFreeTime)
    setDemoDone(false)
  }

  const simulateBooking = () => {
    if (!selectedDay || !time) return
    setSimulated((previous) => new Set(previous).add(`${selectedDay}T${time}`))
    setSelectedTime(null)
    setDemoDone(true)
  }

  return (
    <section id='booking' aria-labelledby='booking-heading' className='py-[var(--spacing-s6)]'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s4)]')}>
        <SectionIntro id='booking-heading' title={copy.heading} subtitle={copy.subtitle} description={copy.intro} />

        {demo ? (
          <p
            role='note'
            data-demo-calendar='true'
            className='border-sage/40 text-body bg-paper/60 m-0 max-w-3xl rounded-(--radius-md) border border-dashed px-4 py-3 text-[length:var(--text-fluid--1)]'
          >
            {applyCzechNbsp(copy.demoNotice)}
          </p>
        ) : null}

        <div
          data-booking-card
          className='bg-paper border-line shadow-soft reveal-soft grid gap-[var(--spacing-s5)] rounded-(--radius-lg) border p-[clamp(1rem,0.4rem+2.6vw,3rem)] min-[62rem]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[62rem]:gap-[var(--spacing-s6)]'
        >
          <div className='grid min-w-0 content-start gap-[var(--spacing-s4)]'>
            <ServiceSelect />

            <div>
              <StepLabel no={2} state={activeDay ? 'done' : 'active'}>
                {copy.steps.day}
              </StepLabel>
              {nextFree && nextFreeTime ? (
                <button
                  type='button'
                  onClick={chooseNextFree}
                  className='border-brand/40 bg-brand-soft text-ink hover:bg-surface-alt mb-3 inline-flex min-h-11 flex-wrap items-center gap-x-2 rounded-full border px-4 py-2 text-left text-[length:var(--text-fluid--1)] leading-snug transition-colors duration-260 ease-(--ease-soft)'
                >
                  {copy.nextFreeLabel}:{' '}
                  <b className='text-ink font-medium'>
                    {applyCzechNbsp(`${formatDayLong(nextFree.key)} v ${nextFreeTime}`)}
                  </b>
                  <span aria-hidden='true' className='text-brand font-medium'>
                    {copy.nextFreeAction} →
                  </span>
                </button>
              ) : null}
              <MonthGrid
                month={month}
                onMonthChange={setMonthOverride}
                minMonth={minMonth}
                maxMonth={maxMonth}
                days={dayMap}
                todayKey={todayKey}
                selectedDay={selectedDay}
                onSelectDay={chooseDay}
              />
            </div>
          </div>

          <div className='grid min-w-0 content-start gap-[var(--spacing-s4)]'>
            <div ref={timesRef} className='scroll-mt-24'>
              <StepLabel no={3} state={time ? 'done' : activeDay ? 'active' : 'pending'}>
                {copy.steps.time}
              </StepLabel>

              <div aria-live='polite' data-testid='booking-times'>
                {activeDay ? (
                  <>
                    <p className='text-ink mb-3 text-[length:var(--text-fluid-1)] leading-tight font-[360]'>
                      {applyCzechNbsp(formatDayLong(activeDay.key))}
                      <span className='text-muted-ink ml-2 text-[length:var(--text-fluid--1)] font-normal'>
                        {activeDay.freeCount > 0 ? pluralFreeSlots(activeDay.freeCount) : copy.legendFull}
                      </span>
                    </p>

                    {activeDay.freeCount === 0 ? (
                      <p className='text-body mb-3 text-[length:var(--text-fluid--1)]'>{copy.dayFullyBooked}</p>
                    ) : null}

                    <ul className='m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4'>
                      {activeDay.slots.map((slot) => {
                        const isSelected = time === slot.time

                        return (
                          <li key={slot.time} className='flex'>
                            {slot.available ? (
                              <button
                                type='button'
                                aria-pressed={isSelected}
                                onClick={() => {
                                  setSelectedTime(slot.time)
                                  setDemoDone(false)
                                  revealSummary()
                                }}
                                className={cn(
                                  'min-h-11 w-full rounded-full border px-3 text-[length:var(--text-fluid--1)] leading-none tabular-nums transition-[background-color,color,border-color] duration-260 ease-(--ease-soft)',
                                  isSelected
                                    ? 'border-brand bg-brand text-on-brand gap-1.5 font-medium'
                                    : 'border-ink/45 bg-paper text-ink hover:bg-surface-alt hover:border-ink/70 font-medium',
                                  'inline-flex items-center justify-center',
                                )}
                              >
                                {isSelected ? (
                                  <Check aria-hidden='true' className='h-3.5 w-3.5' strokeWidth={3} />
                                ) : null}
                                {slot.time}
                              </button>
                            ) : (
                              <span
                                aria-disabled='true'
                                className='text-slot-unavailable bg-surface-alt/50 flex min-h-11 w-full items-center justify-center rounded-full px-3 text-[length:var(--text-fluid--1)] leading-none tabular-nums line-through decoration-1'
                              >
                                {slot.time}
                                <span className='sr-only'> {copy.slotBusy}</span>
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                    {activeDay.slots.some((slot) => !slot.available) ? (
                      <p aria-hidden='true' className='text-muted-ink mt-3 mb-0 text-[0.8125rem]'>
                        {copy.slotLegend}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className='text-muted-ink border-line m-0 rounded-(--radius-md) border border-dashed px-4 py-5 text-[length:var(--text-fluid--1)]'>
                    {copy.pickDayHint}
                  </p>
                )}
              </div>
            </div>

            <div
              ref={summaryRef}
              aria-live='polite'
              data-testid='booking-summary'
              className={cn(
                'bg-surface border-line scroll-mb-24 rounded-(--radius-md) border p-[clamp(1.1rem,0.8rem+1vw,1.6rem)] transition-colors duration-260',
                activeDay && time && 'border-brand/60',
              )}
            >
              <h3 className='text-ink mb-3 text-[length:var(--text-fluid-1)]'>{copy.summaryHeading}</h3>

              {activeDay && time ? (
                <dl className='m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[length:var(--text-fluid--1)]'>
                  <dt className='text-muted-ink'>{copy.summaryService}</dt>
                  <dd className='text-ink m-0'>{applyCzechNbsp(service?.name ?? copy.summaryNoService)}</dd>

                  <dt className='text-muted-ink'>{copy.summaryWhen}</dt>
                  <dd className='text-ink m-0'>
                    {applyCzechNbsp(
                      `${formatDayLong(activeDay.key)}, ${time}${durationMinutes ? `–${addMinutesToTime(time, durationMinutes)}` : ''}`,
                    )}
                  </dd>

                  {service?.duration ? (
                    <>
                      <dt className='text-muted-ink'>{copy.summaryLength}</dt>
                      <dd className='text-ink m-0'>{service.duration}</dd>
                    </>
                  ) : null}

                  {service ? (
                    <>
                      <dt className='text-muted-ink'>{copy.summaryPrice}</dt>
                      <dd className='text-ink m-0'>{applyCzechNbsp(service.price)}</dd>
                    </>
                  ) : null}
                </dl>
              ) : (
                <p className='text-muted-ink m-0 text-[length:var(--text-fluid--1)]'>
                  {demoDone ? copy.demoDone : copy.summaryEmpty}
                </p>
              )}

              <div className='mt-4 grid justify-items-start gap-3'>
                {activeDay && time ? (
                  demo ? (
                    <button type='button' onClick={simulateBooking} className={PRIMARY_BUTTON}>
                      {copy.demoCta}
                    </button>
                  ) : (
                    <a
                      href={getSlotWhatsAppUrl(activeDay.key, time)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={PRIMARY_BUTTON}
                    >
                      {applyCzechNbsp(copy.whatsappCta)}
                    </a>
                  )
                ) : (
                  <button type='button' disabled className={PRIMARY_BUTTON}>
                    {applyCzechNbsp(copy.whatsappCta)}
                  </button>
                )}
                <p className='text-muted-ink m-0 max-w-[40ch] text-[0.8125rem] leading-snug'>
                  {applyCzechNbsp(copy.summaryNote)}{' '}
                  <a href={whatsappCtaUrl} target='_blank' rel='noopener noreferrer' className='link-wipe text-body'>
                    {applyCzechNbsp(copy.flexibilityNote)}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <GoodToKnow />
      </div>
    </section>
  )
}

function firstFreeDay(days: BookingDay[]) {
  return days.find((day) => day.freeCount > 0)
}
