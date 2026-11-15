import { pragueDayKey, pragueTimeInput } from '@/lib/prague-time'

/** Pure helpers behind the public booking calendar (month grid, day slots, summary text). Prague time throughout. */

export interface BookingSlot {
  time: string
  available: boolean
}

export interface BookingDay {
  /** yyyy-MM-dd in Prague */
  key: string
  slots: BookingSlot[]
  freeCount: number
  isToday: boolean
}

const MONTHS_NOMINATIVE = [
  'leden',
  'únor',
  'březen',
  'duben',
  'květen',
  'červen',
  'červenec',
  'srpen',
  'září',
  'říjen',
  'listopad',
  'prosinec',
] as const

const MONTHS_GENITIVE = [
  'ledna',
  'února',
  'března',
  'dubna',
  'května',
  'června',
  'července',
  'srpna',
  'září',
  'října',
  'listopadu',
  'prosince',
] as const

const WEEKDAYS_LOWER = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'] as const

export const WEEKDAY_SHORT = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'] as const

interface RawSlot {
  date: Date | string | number
  reserved?: boolean
}

function toSlots(apiData: unknown): RawSlot[] {
  if (Array.isArray(apiData)) return apiData
  if (apiData && typeof apiData === 'object' && Array.isArray((apiData as { data?: unknown }).data)) {
    return (apiData as { data: RawSlot[] }).data
  }
  return []
}

/**
 * Groups slots by Prague day. Past days are dropped and, for today, slots that already started are dropped
 * as well, so the picker never offers a time that is gone. Days stay in the result when every slot is
 * reserved (freeCount 0) so the calendar can show them as fully booked.
 */
export function buildBookingDays(apiData: unknown, now: Date = new Date()): BookingDay[] {
  const todayKey = pragueDayKey(now)
  const nowTime = pragueTimeInput(now)
  const byDay = new Map<string, BookingSlot[]>()

  for (const raw of toSlots(apiData)) {
    if (!raw) continue
    const date = raw.date instanceof Date ? raw.date : new Date(raw.date)
    if (Number.isNaN(date.getTime())) continue

    const key = pragueDayKey(date)
    if (key < todayKey) continue
    const time = pragueTimeInput(date)
    if (key === todayKey && time <= nowTime) continue

    const list = byDay.get(key) ?? []
    list.push({ time, available: !raw.reserved })
    byDay.set(key, list)
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, slots]) => ({
      key,
      slots: slots.sort((a, b) => a.time.localeCompare(b.time)),
      freeCount: slots.filter((slot) => slot.available).length,
      isToday: key === todayKey,
    }))
}

export function parseDayKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month, day }
}

export function addDaysToKey(key: string, days: number): string {
  const { year, month, day } = parseDayKey(key)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

/** 0 = Monday ... 6 = Sunday. */
export function weekdayOfKey(key: string): number {
  const { year, month, day } = parseDayKey(key)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 ? 6 : weekday - 1
}

export function monthKeyOf(dayKey: string): string {
  return dayKey.slice(0, 7)
}

export function addMonthsToKey(monthKey: string, months: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + months, 1))
  return date.toISOString().slice(0, 7)
}

/** Monday-first weeks of a month as day keys; days of neighbouring months are null. */
export function monthWeeks(monthKey: string): (string | null)[][] {
  const [year, month] = monthKey.split('-').map(Number)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const lead = weekdayOfKey(`${monthKey}-01`)
  const cells: (string | null)[] = Array.from({ length: lead }, () => null)

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${monthKey}-${String(day).padStart(2, '0')}`)
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (string | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7))
  return weeks
}

export function formatMonthTitle(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${MONTHS_NOMINATIVE[month - 1]} ${year}`
}

/** "pondělí 16. listopadu" */
export function formatDayLong(key: string): string {
  const { month, day } = parseDayKey(key)
  return `${WEEKDAYS_LOWER[weekdayOfKey(key)]} ${day}. ${MONTHS_GENITIVE[month - 1]}`
}

/** "16.11." as used in the WhatsApp message. */
export function formatDayShort(key: string): string {
  const { month, day } = parseDayKey(key)
  return `${day}.${month}.`
}

/** Minutes from "50 min" / "60 min"; null when the service has no fixed length. */
export function parseDurationMinutes(duration: string): number | null {
  const match = /^(\d{1,3})\s*min/.exec(duration.trim())
  return match ? Number(match[1]) : null
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = hours * 60 + mins + minutes
  const wrapped = ((total % 1440) + 1440) % 1440
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`
}

export function pluralFreeSlots(count: number): string {
  if (count === 1) return '1 volný termín'
  if (count >= 2 && count <= 4) return `${count} volné termíny`
  return `${count} volných termínů`
}
