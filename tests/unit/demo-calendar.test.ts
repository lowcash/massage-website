import { describe, expect, it } from 'vitest'

import { buildBookingDays } from '../../lib/booking-days'
import { createDemoCalendar, isDemoCalendarEnabled } from '../../lib/demo-calendar'
import { pragueDayKey, pragueTimeInput } from '../../lib/prague-time'

// Sunday 2026-11-15 12:00 Prague
const NOW = new Date('2026-11-15T11:00:00Z')

describe('isDemoCalendarEnabled (gate)', () => {
  it('is off by default', () => {
    expect(isDemoCalendarEnabled({})).toBe(false)
    expect(isDemoCalendarEnabled({ NODE_ENV: 'production' })).toBe(false)
    expect(isDemoCalendarEnabled({ DEMO_CALENDAR: '0' })).toBe(false)
    expect(isDemoCalendarEnabled({ DEMO_CALENDAR: 'true' })).toBe(false)
  })

  it('is on for Vercel preview deployments', () => {
    expect(isDemoCalendarEnabled({ VERCEL_ENV: 'preview' })).toBe(true)
  })

  it('is on with the explicit flag (local runs, e2e)', () => {
    expect(isDemoCalendarEnabled({ DEMO_CALENDAR: '1' })).toBe(true)
    expect(isDemoCalendarEnabled({ DEMO_CALENDAR: '1', VERCEL_ENV: 'development' })).toBe(true)
  })

  it('is never on in Vercel production, even when the flag is set by mistake', () => {
    expect(isDemoCalendarEnabled({ VERCEL_ENV: 'production' })).toBe(false)
    expect(isDemoCalendarEnabled({ VERCEL_ENV: 'production', DEMO_CALENDAR: '1' })).toBe(false)
  })
})

describe('createDemoCalendar', () => {
  const slots = createDemoCalendar(NOW)
  const days = buildBookingDays(slots, NOW)

  it('covers the next four weeks and nothing in the past', () => {
    const keys = days.map((day) => day.key)
    expect(keys[0] >= pragueDayKey(NOW)).toBe(true)
    const last = new Date(`${keys.at(-1)}T12:00:00Z`).getTime()
    const first = new Date(`${pragueDayKey(NOW)}T12:00:00Z`).getTime()
    expect((last - first) / 86_400_000).toBeGreaterThanOrEqual(21)
    expect((last - first) / 86_400_000).toBeLessThan(28)
  })

  it('mixes free and busy slots and has fully booked days that are not empty', () => {
    expect(days.some((day) => day.freeCount > 0 && day.freeCount < day.slots.length)).toBe(true)
    expect(days.filter((day) => day.freeCount === 0 && day.slots.length > 0).length).toBeGreaterThanOrEqual(2)
    expect(days.filter((day) => day.freeCount > 0).length).toBeGreaterThanOrEqual(10)
  })

  it('stays inside opening hours (Prague wall clock) and never offers Sunday', () => {
    for (const slot of slots) {
      const time = pragueTimeInput(slot.date)
      expect(time >= '10:00' && time <= '20:00').toBe(true)
      expect(new Date(`${pragueDayKey(slot.date)}T12:00:00Z`).getUTCDay()).not.toBe(0)
    }
  })

  it('is deterministic', () => {
    expect(createDemoCalendar(NOW)).toEqual(createDemoCalendar(NOW))
  })
})
