'use client'

import { useState } from 'react'

import { Check, ChevronDown, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { combineDateTime, isDateTimeInFuture } from './utils/calendar'

interface AddTimeFormProps {
  /** yyyy-MM-dd (Prague) of the day the new time is added to. */
  dayKey: string
  /** "HH:mm" times this day already has. */
  takenTimes: Set<string>
  isLoading: boolean
  /** Resolves to true when the slot was saved. */
  onAdd: (timeStr: string) => Promise<boolean>
}

const QUICK_HOURS = Array.from({ length: 14 }, (_, index) => index + 8)
const HOURS = Array.from({ length: 24 }, (_, index) => index)
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5)

const pad = (value: number) => String(value).padStart(2, '0')

const selectClassName =
  'border-line focus:border-brand focus:ring-brand/20 text-ink h-12 w-full cursor-pointer appearance-none rounded-xl border bg-white pr-9 pl-3 text-base outline-none focus:ring-4 disabled:opacity-60'

/** One click on a time adds it; the less common times are reachable through "Jiný čas". */
export function AddTimeForm({ dayKey, takenTimes, isLoading, onAdd }: AddTimeFormProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [hour, setHour] = useState(15)
  const [minute, setMinute] = useState(30)

  const isPast = (time: string) => !isDateTimeInFuture(combineDateTime(dayKey, time))

  return (
    <div className='border-line flex flex-col gap-4 border-t pt-5'>
      <div>
        <h4 className='text-ink text-sm font-medium'>Přidat čas</h4>
        <p className='text-muted-ink text-sm'>Klepněte na čas, který chcete k tomuto dni přidat.</p>
      </div>

      <div className='grid grid-cols-4 gap-2 sm:grid-cols-7'>
        {QUICK_HOURS.map((quickHour) => {
          const time = `${pad(quickHour)}:00`
          const taken = takenTimes.has(time)
          const past = !taken && isPast(time)

          return (
            <button
              key={time}
              type='button'
              disabled={isLoading || taken || past}
              aria-label={taken ? `${time} už je přidáno` : `Přidat ${time}`}
              onClick={() => onAdd(time)}
              className={cn(
                'focus-visible:ring-brand/40 flex h-11 cursor-pointer items-center justify-center gap-1 rounded-xl border text-sm tabular-nums transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed',
                taken
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : past
                    ? 'border-line text-muted-ink/40 bg-white'
                    : 'border-line text-ink hover:border-brand hover:bg-brand/8 bg-white',
              )}
            >
              {taken ? <Check aria-hidden='true' className='h-3.5 w-3.5' /> : null}
              {time}
            </button>
          )
        })}
      </div>

      <div>
        <button
          type='button'
          onClick={() => setShowCustom((open) => !open)}
          aria-expanded={showCustom}
          className='text-brand hover:text-brand-hover flex cursor-pointer items-center gap-1.5 text-sm underline-offset-4 hover:underline'
        >
          <Plus aria-hidden='true' className='h-4 w-4' />
          Jiný čas
        </button>

        {showCustom ? (
          <form
            className='mt-3 flex items-end gap-3'
            onSubmit={async (event) => {
              event.preventDefault()
              await onAdd(`${pad(hour)}:${pad(minute)}`)
            }}
          >
            <div className='relative flex-1'>
              <label htmlFor='custom-hour' className='sr-only'>
                Hodina
              </label>
              <select
                id='custom-hour'
                value={hour}
                disabled={isLoading}
                onChange={(event) => setHour(Number(event.target.value))}
                className={selectClassName}
              >
                {HOURS.map((value) => (
                  <option key={value} value={value}>
                    {pad(value)} h
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden='true'
                className='text-muted-ink pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2'
              />
            </div>

            <div className='relative flex-1'>
              <label htmlFor='custom-minute' className='sr-only'>
                Minuta
              </label>
              <select
                id='custom-minute'
                value={minute}
                disabled={isLoading}
                onChange={(event) => setMinute(Number(event.target.value))}
                className={selectClassName}
              >
                {MINUTES.map((value) => (
                  <option key={value} value={value}>
                    {pad(value)} min
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden='true'
                className='text-muted-ink pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='bg-brand hover:bg-brand-hover focus-visible:ring-brand/30 flex h-12 cursor-pointer items-center gap-2 rounded-xl px-6 text-sm font-medium text-white transition-colors outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Přidat
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
