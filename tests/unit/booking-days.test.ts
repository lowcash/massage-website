import { describe, expect, it } from 'vitest'

import {
  addMinutesToTime,
  addMonthsToKey,
  buildBookingDays,
  formatDayLong,
  monthWeeks,
  parseDurationMinutes,
  pluralFreeSlots,
  weekdayOfKey,
} from '../../lib/booking-days'

// Monday 2026-11-16 12:00 Prague (11:00 UTC)
const NOW = new Date('2026-11-16T11:00:00Z')

describe('buildBookingDays', () => {
  it('returns nothing without data', () => {
    expect(buildBookingDays(undefined, NOW)).toEqual([])
    expect(buildBookingDays([], NOW)).toEqual([])
  })

  it('groups by Prague day, sorts times, counts free slots and drops past days', () => {
    const days = buildBookingDays(
      [
        { date: new Date('2026-11-15T14:00:00Z'), reserved: false }, // yesterday
        { date: new Date('2026-11-17T16:00:00Z'), reserved: true }, // 17:00
        { date: new Date('2026-11-17T14:00:00Z'), reserved: false }, // 15:00
      ],
      NOW,
    )

    expect(days).toHaveLength(1)
    expect(days[0].key).toBe('2026-11-17')
    expect(days[0].slots.map((slot) => slot.time)).toEqual(['15:00', '17:00'])
    expect(days[0].freeCount).toBe(1)
  })

  it('drops slots of today that already started and keeps fully booked days', () => {
    const days = buildBookingDays(
      [
        { date: new Date('2026-11-16T10:00:00Z'), reserved: false }, // 11:00, started
        { date: new Date('2026-11-16T15:00:00Z'), reserved: false }, // 16:00 free
        { date: new Date('2026-11-18T14:00:00Z'), reserved: true },
      ],
      NOW,
    )

    expect(days[0].slots.map((slot) => slot.time)).toEqual(['16:00'])
    expect(days[0].isToday).toBe(true)
    expect(days[1].freeCount).toBe(0)
    expect(days[1].slots).toHaveLength(1)
  })

  it('accepts the { data } wrapper and ISO strings', () => {
    const days = buildBookingDays({ data: [{ date: '2026-11-17T14:00:00.000Z', reserved: false }] }, NOW)
    expect(days).toHaveLength(1)
  })
})

describe('month helpers', () => {
  it('builds Monday-first weeks padded with nulls', () => {
    const weeks = monthWeeks('2026-11')
    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(weeks[0][6]).toBe('2026-11-01') // 1 November 2026 is a Sunday
    expect(weeks[0].slice(0, 6).every((cell) => cell === null)).toBe(true)
    expect(weeks.flat().filter(Boolean)).toHaveLength(30)
  })

  it('computes weekdays and month arithmetic across year ends', () => {
    expect(weekdayOfKey('2026-11-16')).toBe(0)
    expect(weekdayOfKey('2026-11-22')).toBe(6)
    expect(addMonthsToKey('2026-12', 1)).toBe('2027-01')
    expect(addMonthsToKey('2026-01', -1)).toBe('2025-12')
  })
})

describe('Czech formatting and durations', () => {
  it('formats long days', () => {
    expect(formatDayLong('2026-11-16')).toBe('pondělí 16. listopadu')
  })

  it('pluralises free slots', () => {
    expect([1, 3, 5].map(pluralFreeSlots)).toEqual(['1 volný termín', '3 volné termíny', '5 volných termínů'])
  })

  it('parses service durations and computes end times', () => {
    expect(parseDurationMinutes('50 min')).toBe(50)
    expect(parseDurationMinutes('')).toBeNull()
    expect(addMinutesToTime('19:30', 60)).toBe('20:30')
    expect(addMinutesToTime('23:30', 60)).toBe('00:30')
  })
})
