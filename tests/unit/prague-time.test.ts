import { describe, expect, it } from 'vitest'

import {
  combinePragueDateTime,
  mapApiDataToDisplay,
  pragueDayKey,
  pragueFormatDateTime,
  pragueStartOfDay,
  pragueTimeInput,
  pragueWeekdayIndexMon0,
} from '@/lib/prague-time'

const DAY_NAMES = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'] as const

/** Last Sunday of March 2026 — CET→CEST at 02:00 Prague. */
const DST_SPRING = '2026-03-29'
/** Last Sunday of October 2026 — CEST→CET at 03:00 Prague. */
const DST_FALL = '2026-10-25'

describe('combinePragueDateTime', () => {
  it('maps winter Prague wall time to the correct UTC instant', () => {
    // 15:00 Prague in January = 14:00 UTC
    const result = combinePragueDateTime('2026-01-15', '15:00')
    expect(result).not.toBeNull()
    expect(result!.toISOString()).toBe('2026-01-15T14:00:00.000Z')
  })

  it('maps summer Prague wall time to the correct UTC instant', () => {
    // 15:00 Prague in July = 13:00 UTC
    const result = combinePragueDateTime('2026-07-15', '15:00')
    expect(result).not.toBeNull()
    expect(result!.toISOString()).toBe('2026-07-15T13:00:00.000Z')
  })

  it('handles the hour after spring-forward on the last Sunday of March', () => {
    // 03:30 does not exist in the gap; offset trick still produces a stable instant
    // whose Prague readout is past the transition.
    const before = combinePragueDateTime(DST_SPRING, '01:30')!
    const after = combinePragueDateTime(DST_SPRING, '03:30')!
    expect(pragueTimeInput(before)).toBe('01:30')
    expect(pragueDayKey(before)).toBe(DST_SPRING)
    expect(pragueDayKey(after)).toBe(DST_SPRING)
    expect(after.getTime()).toBeGreaterThan(before.getTime())
    // CEST: 03:30 Prague = 01:30 UTC
    expect(after.toISOString()).toBe('2026-03-29T01:30:00.000Z')
  })

  it('handles the ambiguous hour on the last Sunday of October', () => {
    const early = combinePragueDateTime(DST_FALL, '01:30')!
    const late = combinePragueDateTime(DST_FALL, '02:30')!
    expect(pragueDayKey(early)).toBe(DST_FALL)
    expect(pragueDayKey(late)).toBe(DST_FALL)
    expect(pragueTimeInput(early)).toBe('01:30')
    expect(pragueTimeInput(late)).toBe('02:30')
    expect(late.getTime()).toBeGreaterThan(early.getTime())
  })

  it('returns null for empty inputs', () => {
    expect(combinePragueDateTime('', '15:00')).toBeNull()
    expect(combinePragueDateTime('2026-01-15', '')).toBeNull()
  })
})

describe('prague formatters', () => {
  it('formats day key and time from a known UTC instant', () => {
    const utc = new Date('2026-07-15T13:00:00.000Z') // 15:00 Prague
    expect(pragueDayKey(utc)).toBe('2026-07-15')
    expect(pragueTimeInput(utc)).toBe('15:00')
    expect(pragueFormatDateTime(utc)).toBe('15.07.2026 15:00')
  })

  it('formats across the spring DST boundary', () => {
    const cet = new Date('2026-03-29T00:30:00.000Z') // 01:30 CET
    const cest = new Date('2026-03-29T01:30:00.000Z') // 03:30 CEST
    expect(pragueTimeInput(cet)).toBe('01:30')
    expect(pragueTimeInput(cest)).toBe('03:30')
    expect(pragueDayKey(cet)).toBe(DST_SPRING)
    expect(pragueDayKey(cest)).toBe(DST_SPRING)
  })

  it('formats across the fall DST boundary', () => {
    // 00:30 UTC = 02:30 CEST (still summer); 01:30 UTC = 02:30 CET (after fall-back)
    const beforeFold = new Date('2026-10-25T00:30:00.000Z')
    const afterFold = new Date('2026-10-25T01:30:00.000Z')
    expect(pragueDayKey(beforeFold)).toBe(DST_FALL)
    expect(pragueDayKey(afterFold)).toBe(DST_FALL)
    expect(pragueTimeInput(beforeFold)).toBe('02:30')
    expect(pragueTimeInput(afterFold)).toBe('02:30')
  })
})

describe('mapApiDataToDisplay', () => {
  it('groups, filters past days, marks today, and sorts times', () => {
    const now = combinePragueDateTime('2026-07-15', '10:00')!
    const slots = [
      { date: combinePragueDateTime('2026-07-14', '16:00')!, reserved: false },
      { date: combinePragueDateTime('2026-07-15', '14:00')!, reserved: true },
      { date: combinePragueDateTime('2026-07-15', '09:30')!, reserved: false },
      { date: combinePragueDateTime('2026-07-16', '11:00')!, reserved: false },
    ]

    const result = mapApiDataToDisplay(slots, DAY_NAMES, now)
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      day: 'Středa',
      date: '15.7.',
      isToday: true,
      slots: [
        { time: '09:30', available: true },
        { time: '14:00', available: false },
      ],
    })
    expect(result[1]).toMatchObject({
      day: 'Čtvrtek',
      date: '16.7.',
      isToday: false,
      slots: [{ time: '11:00', available: true }],
    })
  })

  it('accepts { data: [...] } wrappers and empty input', () => {
    expect(mapApiDataToDisplay(undefined, DAY_NAMES)).toEqual([])
    expect(mapApiDataToDisplay({ data: [] }, DAY_NAMES)).toEqual([])
    const slot = { date: combinePragueDateTime('2026-07-20', '12:00')!, reserved: false }
    const wrapped = mapApiDataToDisplay({ data: [slot] }, DAY_NAMES, combinePragueDateTime('2026-07-15', '00:00')!)
    expect(wrapped).toHaveLength(1)
  })

  it('keeps slots on the spring DST Sunday', () => {
    const now = combinePragueDateTime(DST_SPRING, '00:30')!
    const slots = [
      { date: combinePragueDateTime(DST_SPRING, '01:30')!, reserved: false },
      { date: combinePragueDateTime(DST_SPRING, '03:30')!, reserved: false },
    ]
    const result = mapApiDataToDisplay(slots, DAY_NAMES, now)
    expect(result).toHaveLength(1)
    expect(result[0].date).toBe('29.3.')
    expect(result[0].slots.map((s) => s.time)).toEqual(['01:30', '03:30'])
    expect(pragueWeekdayIndexMon0(slots[0].date)).toBe(6) // Sunday
  })

  it('skips invalid dates without throwing', () => {
    const now = combinePragueDateTime('2026-07-15', '10:00')!
    const valid = { date: combinePragueDateTime('2026-07-16', '11:00')!, reserved: false }
    const result = mapApiDataToDisplay([valid, { date: new Date('not-a-date'), reserved: false }], DAY_NAMES, now)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      day: 'Čtvrtek',
      date: '16.7.',
      slots: [{ time: '11:00', available: true }],
    })
  })

  it('leaves valid dates unchanged when mixed with invalid ones', () => {
    const now = combinePragueDateTime('2026-07-15', '10:00')!
    const slots = [
      { date: combinePragueDateTime('2026-07-15', '09:30')!, reserved: false },
      { date: new Date(Number.NaN), reserved: true },
      { date: combinePragueDateTime('2026-07-15', '14:00')!, reserved: true },
    ]
    const withInvalid = mapApiDataToDisplay(slots, DAY_NAMES, now)
    const withoutInvalid = mapApiDataToDisplay([slots[0], slots[2]], DAY_NAMES, now)
    expect(withInvalid).toEqual(withoutInvalid)
  })
})

describe('pragueStartOfDay', () => {
  it('returns midnight Prague as a UTC instant', () => {
    const noonUtc = new Date('2026-07-15T12:00:00.000Z')
    const start = pragueStartOfDay(noonUtc)
    expect(pragueTimeInput(start)).toBe('00:00')
    expect(pragueDayKey(start)).toBe('2026-07-15')
  })
})
