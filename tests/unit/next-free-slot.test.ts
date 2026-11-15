import { describe, expect, it } from 'vitest'

import { findNextFreeSlot } from '../../lib/next-free-slot'

const DAY_NAMES = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
// Monday 2026-11-16 12:00 Prague (11:00 UTC)
const NOW = new Date('2026-11-16T11:00:00Z')

describe('findNextFreeSlot', () => {
  it('returns null without data', () => {
    expect(findNextFreeSlot(undefined, DAY_NAMES, NOW)).toBeNull()
    expect(findNextFreeSlot([], DAY_NAMES, NOW)).toBeNull()
  })

  it('skips reserved slots and slots already started today', () => {
    const data = [
      { date: new Date('2026-11-16T10:00:00Z'), reserved: false }, // 11:00 Prague, already past
      { date: new Date('2026-11-16T14:00:00Z'), reserved: true }, // 15:00 reserved
      { date: new Date('2026-11-16T15:30:00Z'), reserved: false }, // 16:30 free
    ]

    expect(findNextFreeSlot(data, DAY_NAMES, NOW)).toEqual({
      day: 'Pondělí',
      date: expect.any(String),
      time: '16:30',
      isToday: true,
    })
  })

  it('moves on to a later day when today has nothing free', () => {
    const data = [
      { date: new Date('2026-11-16T14:00:00Z'), reserved: true },
      { date: new Date('2026-11-17T14:00:00Z'), reserved: false },
    ]

    const result = findNextFreeSlot(data, DAY_NAMES, NOW)
    expect(result?.day).toBe('Úterý')
    expect(result?.time).toBe('15:00')
    expect(result?.isToday).toBe(false)
  })
})
