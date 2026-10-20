'use client'

import { useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { CalendarItem } from '@/types/calendar'

interface MonthCalendarProps {
  items: CalendarItem[]
  selectedDay: string
  onSelectDay: (dayKey: string) => void
}

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' })
const monthFormatter = new Intl.DateTimeFormat('cs-CZ', { timeZone: 'UTC', month: 'long', year: 'numeric' })
const longDayFormatter = new Intl.DateTimeFormat('cs-CZ', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const WEEKDAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

const toKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

function pluralize(count: number, one: string, few: string, many: string) {
  return count === 1 ? one : count < 5 ? few : many
}

/** Month overview: every day shows how many slots are free and how many are booked. */
export function MonthCalendar({ items, selectedDay, onSelectDay }: MonthCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0)

  const todayKey = dayKeyFormatter.format(new Date())
  const [todayYear, todayMonth] = todayKey.split('-').map(Number)
  const firstOfMonth = new Date(Date.UTC(todayYear, todayMonth - 1 + monthOffset, 1))
  const year = firstOfMonth.getUTCFullYear()
  const month = firstOfMonth.getUTCMonth() + 1
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const leadingBlanks = (firstOfMonth.getUTCDay() + 6) % 7

  const counts = new Map<string, { free: number; reserved: number }>()
  for (const item of items) {
    const key = dayKeyFormatter.format(item.date)
    const entry = counts.get(key) ?? { free: 0, reserved: 0 }
    if (item.reserved) {
      entry.reserved += 1
    } else {
      entry.free += 1
    }
    counts.set(key, entry)
  }

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <button
          type='button'
          onClick={() => setMonthOffset((offset) => offset - 1)}
          disabled={monthOffset === 0}
          aria-label='Předchozí měsíc'
          className='hover:bg-surface-alt flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-30'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <p className='font-display text-ink text-xl capitalize' aria-live='polite'>
          {monthFormatter.format(firstOfMonth)}
        </p>
        <button
          type='button'
          onClick={() => setMonthOffset((offset) => offset + 1)}
          aria-label='Další měsíc'
          className='hover:bg-surface-alt flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      <div className='text-muted-ink mb-1 grid grid-cols-7 text-center text-xs'>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className='py-1'>
            {weekday}
          </span>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden='true' />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const key = toKey(year, month, day)
          const entry = counts.get(key)
          const isPast = key < todayKey
          const isToday = key === todayKey
          const isSelected = key === selectedDay
          const label = longDayFormatter.format(new Date(Date.UTC(year, month - 1, day)))
          const summary = entry
            ? `${entry.free} ${pluralize(entry.free, 'volný', 'volné', 'volných')}, ${entry.reserved} ${pluralize(entry.reserved, 'rezervovaný', 'rezervované', 'rezervovaných')}`
            : 'žádné termíny'

          return (
            <button
              key={key}
              type='button'
              disabled={isPast}
              aria-pressed={isSelected}
              aria-label={`${label}: ${summary}`}
              onClick={() => onSelectDay(key)}
              className={cn(
                'focus-visible:ring-brand/40 relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-sm transition-colors outline-none focus-visible:ring-2',
                isSelected ? 'bg-brand text-white' : 'hover:bg-surface-alt text-ink',
                isToday && !isSelected && 'ring-brand/50 ring-1',
                isPast && 'text-muted-ink/40 cursor-not-allowed hover:bg-transparent',
              )}
            >
              <span className='leading-none'>{day}</span>
              {entry ? (
                <span className='mt-1 flex gap-0.5' aria-hidden='true'>
                  {entry.free > 0 ? (
                    <span className={cn('h-1.5 w-1.5 rounded-full', isSelected ? 'bg-white' : 'bg-emerald-500')} />
                  ) : null}
                  {entry.reserved > 0 ? (
                    <span className={cn('h-1.5 w-1.5 rounded-full', isSelected ? 'bg-white/60' : 'bg-brand')} />
                  ) : null}
                </span>
              ) : (
                <span className='mt-1 h-1.5' aria-hidden='true' />
              )}
            </button>
          )
        })}
      </div>

      <p className='text-muted-ink mt-3 flex items-center gap-4 text-xs'>
        <span className='flex items-center gap-1.5'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> volné
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='bg-brand h-1.5 w-1.5 rounded-full' /> rezervované
        </span>
      </p>
    </div>
  )
}
