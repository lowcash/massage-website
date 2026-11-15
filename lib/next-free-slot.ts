import { mapApiDataToDisplay, pragueTimeInput } from '@/lib/prague-time'

export interface NextFreeSlot {
  day: string
  date: string
  time: string
  isToday: boolean
}

/**
 * First bookable slot for the hero badge. Read-only view over mapApiDataToDisplay:
 * today's slots that already started are skipped, reserved slots are never returned.
 */
export function findNextFreeSlot(
  apiData: unknown,
  dayNames: readonly string[],
  now: Date = new Date(),
): NextFreeSlot | null {
  const nowTime = pragueTimeInput(now)

  for (const day of mapApiDataToDisplay(apiData, dayNames, now)) {
    const slot = day.slots.find((candidate) => candidate.available && (!day.isToday || candidate.time > nowTime))
    if (slot) {
      return { day: day.day, date: day.date, time: slot.time, isToday: day.isToday }
    }
  }

  return null
}
