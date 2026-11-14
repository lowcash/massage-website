import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { combinePragueDateTime } from '@/lib/prague-time'

import { filterFutureCalendarItems } from '@/src/components/features/admin/utils/calendar'

import type { CalendarItem } from '@/types/calendar'

describe('filterFutureCalendarItems', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(combinePragueDateTime('2026-07-15', '10:00')!)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('skips invalid dates without throwing', () => {
    const items: CalendarItem[] = [
      { date: new Date('not-a-date'), reserved: false },
      { date: combinePragueDateTime('2026-07-16', '11:00')!, reserved: false },
    ]
    const result = filterFutureCalendarItems(items)
    expect(result).toHaveLength(1)
    expect(result[0].date).toEqual(items[1].date)
  })

  it('leaves valid dates unchanged when mixed with invalid ones', () => {
    const today = { date: combinePragueDateTime('2026-07-15', '09:30')!, reserved: false }
    const future = { date: combinePragueDateTime('2026-07-16', '11:00')!, reserved: true }
    const past = { date: combinePragueDateTime('2026-07-14', '16:00')!, reserved: false }
    const invalid = { date: new Date(Number.NaN), reserved: true }

    const withInvalid = filterFutureCalendarItems([past, today, invalid, future])
    const withoutInvalid = filterFutureCalendarItems([past, today, future])
    expect(withInvalid).toEqual(withoutInvalid)
    expect(withInvalid).toEqual([today, future])
  })
})
