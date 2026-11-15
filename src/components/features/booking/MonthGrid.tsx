'use client'

import { type KeyboardEvent, useEffect, useRef } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  type BookingDay,
  WEEKDAY_SHORT,
  addDaysToKey,
  addMonthsToKey,
  formatDayLong,
  formatMonthTitle,
  monthKeyOf,
  monthWeeks,
  parseDayKey,
  pluralFreeSlots,
} from '@/lib/booking-days'
import { siteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

interface MonthGridProps {
  month: string
  onMonthChange: (month: string) => void
  minMonth: string
  maxMonth: string
  days: Map<string, BookingDay>
  todayKey: string
  selectedDay: string | null
  onSelectDay: (key: string) => void
}

const NAV_BUTTON =
  'inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-260 ease-(--ease-soft) hover:bg-surface-alt disabled:cursor-not-allowed disabled:text-slot-unavailable disabled:hover:bg-transparent'

/** Up to three small dots: a glanceable "how free is this day". The accessible name carries the real count. */
function dotCount(freeCount: number) {
  return Math.min(3, Math.ceil(freeCount / 2))
}

/**
 * Month overview with availability dots. ARIA grid with a roving tabindex: Tab enters the grid once,
 * arrow keys move by day/week, Home/End jump within the week, PageUp/PageDown change the month.
 */
export default function MonthGrid({
  month,
  onMonthChange,
  minMonth,
  maxMonth,
  days,
  todayKey,
  selectedDay,
  onSelectDay,
}: MonthGridProps) {
  const copy = siteContent.calendar
  const gridRef = useRef<HTMLDivElement>(null)
  const focusKeyRef = useRef<string | null>(null)
  const pendingFocus = useRef<string | null>(null)

  const weeks = monthWeeks(month)
  const inMonth = weeks.flat().filter((key): key is string => key !== null)
  const firstFree = inMonth.find((key) => (days.get(key)?.freeCount ?? 0) > 0)
  const tabKey =
    focusKeyRef.current && monthKeyOf(focusKeyRef.current) === month
      ? focusKeyRef.current
      : selectedDay && monthKeyOf(selectedDay) === month
        ? selectedDay
        : (firstFree ?? inMonth.find((key) => key >= todayKey) ?? inMonth[0])

  useEffect(() => {
    const key = pendingFocus.current
    if (!key) return
    pendingFocus.current = null
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${key}"]`)?.focus()
  })

  const moveFocus = (key: string) => {
    const nextMonth = monthKeyOf(key)
    if (nextMonth < minMonth || nextMonth > maxMonth) return
    focusKeyRef.current = key
    pendingFocus.current = key
    if (nextMonth !== month) onMonthChange(nextMonth)
    else gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${key}"]`)?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-day]')
    const current = target?.dataset.day
    if (!current) return

    const { day } = parseDayKey(current)
    let next: string
    switch (event.key) {
      case 'ArrowLeft':
        next = addDaysToKey(current, -1)
        break
      case 'ArrowRight':
        next = addDaysToKey(current, 1)
        break
      case 'ArrowUp':
        next = addDaysToKey(current, -7)
        break
      case 'ArrowDown':
        next = addDaysToKey(current, 7)
        break
      case 'Home':
        next = addDaysToKey(current, -columnOf(weeks, current))
        break
      case 'End':
        next = addDaysToKey(current, 6 - columnOf(weeks, current))
        break
      case 'PageUp':
      case 'PageDown': {
        const target = addMonthsToKey(monthKeyOf(current), event.key === 'PageUp' ? -1 : 1)
        const lastDay = new Date(Date.UTC(Number(target.slice(0, 4)), Number(target.slice(5, 7)), 0)).getUTCDate()
        next = `${target}-${String(Math.min(day, lastDay)).padStart(2, '0')}`
        break
      }
      default:
        return
    }

    event.preventDefault()
    moveFocus(next)
  }

  return (
    <div>
      <div className='mb-3 flex items-center justify-between gap-2'>
        <h3
          id='booking-month-title'
          aria-live='polite'
          className='text-ink text-[length:var(--text-fluid-1)] leading-tight font-[360] capitalize'
        >
          {formatMonthTitle(month)}
        </h3>
        <div className='-mr-2 flex items-center'>
          <button
            type='button'
            className={NAV_BUTTON}
            aria-label={copy.prevMonth}
            disabled={month <= minMonth}
            onClick={() => onMonthChange(addMonthsToKey(month, -1))}
          >
            <ChevronLeft className='h-5 w-5' aria-hidden='true' />
          </button>
          <button
            type='button'
            className={NAV_BUTTON}
            aria-label={copy.nextMonth}
            disabled={month >= maxMonth}
            onClick={() => onMonthChange(addMonthsToKey(month, 1))}
          >
            <ChevronRight className='h-5 w-5' aria-hidden='true' />
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        role='grid'
        aria-labelledby='booking-month-title'
        aria-describedby='booking-grid-hint'
        onKeyDown={handleKeyDown}
        className='grid gap-y-1'
      >
        <div role='row' className='grid grid-cols-7'>
          {WEEKDAY_SHORT.map((label) => (
            <span
              key={label}
              role='columnheader'
              className='text-muted-ink py-1.5 text-center text-[0.75rem] tracking-[0.08em] uppercase'
            >
              {label}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role='row' className='grid grid-cols-7'>
            {week.map((key, cellIndex) => {
              if (!key) return <span key={`blank-${cellIndex}`} role='gridcell' aria-hidden='true' />

              const info = days.get(key)
              const isPast = key < todayKey
              const free = info?.freeCount ?? 0
              const hasSlots = Boolean(info && info.slots.length > 0)
              const fullyBooked = hasSlots && free === 0
              const selectable = !isPast && hasSlots
              const isSelected = selectedDay === key
              const isToday = key === todayKey
              const { day } = parseDayKey(key)

              const state = isPast
                ? ''
                : free > 0
                  ? pluralFreeSlots(free)
                  : fullyBooked
                    ? copy.legendFull
                    : copy.legendNone

              return (
                <span key={key} role='gridcell' aria-selected={selectable ? isSelected : undefined} className='flex'>
                  <button
                    type='button'
                    data-day={key}
                    tabIndex={key === tabKey ? 0 : -1}
                    aria-disabled={!selectable || undefined}
                    aria-pressed={selectable ? isSelected : undefined}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${formatDayLong(key)}${isToday ? ', dnes' : ''}${state ? `, ${state}` : ''}`}
                    onClick={() => {
                      focusKeyRef.current = key
                      if (selectable) onSelectDay(key)
                    }}
                    className={cn(
                      'relative mx-auto flex h-11 w-full max-w-[3.25rem] flex-col items-center justify-center gap-[3px] rounded-full text-[length:var(--text-fluid--1)] tabular-nums transition-colors duration-260 ease-(--ease-soft)',
                      isSelected
                        ? 'bg-brand text-on-brand'
                        : selectable
                          ? 'text-ink hover:bg-surface-alt'
                          : isPast || !hasSlots
                            ? 'text-slot-unavailable cursor-default'
                            : 'text-slot-unavailable',
                      isToday && !isSelected && 'ring-ink/25 ring-1',
                    )}
                  >
                    <span className='leading-none'>{day}</span>
                    <span aria-hidden='true' className='flex h-[5px] items-center gap-[3px]'>
                      {free > 0 ? (
                        Array.from({ length: dotCount(free) }, (_, dot) => (
                          <span
                            key={dot}
                            className={cn('h-[5px] w-[5px] rounded-full', isSelected ? 'bg-on-brand' : 'bg-sage')}
                          />
                        ))
                      ) : fullyBooked && !isPast ? (
                        <span
                          className={cn(
                            'h-[5px] w-[5px] rounded-full border',
                            isSelected ? 'border-on-brand' : 'border-slot-unavailable',
                          )}
                        />
                      ) : null}
                    </span>
                  </button>
                </span>
              )
            })}
          </div>
        ))}
      </div>

      <p id='booking-grid-hint' className='sr-only'>
        {copy.gridHint}
      </p>

      <ul
        aria-hidden='true'
        className='text-muted-ink mt-4 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[0.8125rem]'
      >
        <li className='flex items-center gap-2'>
          <span className='bg-sage h-[5px] w-[5px] rounded-full' />
          {copy.legendFree}
        </li>
        <li className='flex items-center gap-2'>
          <span className='border-slot-unavailable h-[5px] w-[5px] rounded-full border' />
          {copy.legendFull}
        </li>
      </ul>
    </div>
  )
}

/** Column (0 = Monday) of a day inside the month's weeks. */
function columnOf(weeks: (string | null)[][], key: string) {
  for (const row of weeks) {
    const index = row.indexOf(key)
    if (index >= 0) return index
  }
  return 0
}
