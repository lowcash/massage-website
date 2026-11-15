import { combinePragueDateTime, pragueDayKey, pragueWeekdayIndexMon0 } from '@/lib/prague-time'

/**
 * Demo calendar for design previews. Without a Redis a preview deployment shows an empty booking section, so
 * the owner could not judge the calendar. In demo mode the public calendar is served from this generated data
 * and Redis is neither read nor written.
 *
 * The gate is deliberately narrow and fails closed:
 *  - never when VERCEL_ENV is "production" (even if DEMO_CALENDAR is set by mistake),
 *  - on when VERCEL_ENV is "preview",
 *  - on when DEMO_CALENDAR is exactly "1" (local runs, e2e).
 */
export function isDemoCalendarEnabled(env: Record<string, string | undefined> = process.env): boolean {
  if (env.VERCEL_ENV === 'production') return false
  return env.VERCEL_ENV === 'preview' || env.DEMO_CALENDAR === '1'
}

export interface DemoSlot {
  date: Date
  reserved: boolean
}

/** Start times (Prague wall clock) offered on a working day. Opening hours are Mon-Fri 15:00-21:00. */
const WEEKDAY_TIMES = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'] as const
const SATURDAY_TIMES = ['10:00', '11:30', '13:00'] as const

const DEMO_DAYS = 28

function addDays(dayKey: string, days: number): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

/**
 * Deterministic sample for the next four weeks: mixed free and busy slots, two fully booked working days,
 * one day off, and a few Saturdays "by arrangement". No randomness, so a preview looks the same on every load.
 */
export function createDemoCalendar(now: Date = new Date()): DemoSlot[] {
  const today = pragueDayKey(now)
  const slots: DemoSlot[] = []
  let workingDay = 0

  for (let offset = 0; offset < DEMO_DAYS; offset++) {
    const dayKey = addDays(today, offset)
    const weekday = pragueWeekdayIndexMon0(combinePragueDateTime(dayKey, '12:00')!)

    if (weekday === 6) continue

    if (weekday === 5) {
      // Saturday: only every other one, a few slots, mostly free.
      if (Math.floor(offset / 7) % 2 === 0) continue
      SATURDAY_TIMES.forEach((time, index) => {
        slots.push({ date: combinePragueDateTime(dayKey, time)!, reserved: index === 1 })
      })
      continue
    }

    workingDay += 1
    if (workingDay % 11 === 6) continue // a day off, nothing offered
    const fullyBooked = workingDay % 9 === 4

    WEEKDAY_TIMES.forEach((time, index) => {
      const busy = fullyBooked || (workingDay * 5 + index * 3) % 7 < 3
      // Keep at least one free slot on every day that is not fully booked.
      const keepFree = !fullyBooked && index === workingDay % WEEKDAY_TIMES.length
      slots.push({ date: combinePragueDateTime(dayKey, time)!, reserved: busy && !keepFree })
    })
  }

  return slots
}
