/** Europe/Prague wall-clock helpers. Prefer Intl over toLocaleString round-trips. */

const PRAGUE_TZ = 'Europe/Prague'

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: PRAGUE_TZ })
const timePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: PRAGUE_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

type PragueParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

function readParts(date: Date): PragueParts {
  const parts = timePartsFormatter.formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value
    if (!value) throw new Error(`Missing Prague date part: ${type}`)
    return Number(value)
  }

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour') === 24 ? 0 : get('hour'),
    minute: get('minute'),
  }
}

/** yyyy-MM-dd in Prague. */
export function pragueDayKey(date: Date): string {
  return dayKeyFormatter.format(date)
}

/** HH:mm in Prague. */
export function pragueTimeInput(date: Date): string {
  const { hour, minute } = readParts(date)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** dd.MM.yyyy HH:mm in Prague. */
export function pragueFormatDateTime(date: Date): string {
  const { year, month, day, hour, minute } = readParts(date)
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** Prague calendar date as d.M. (no leading zeros), matching the booking UI. */
function pragueDisplayDate(date: Date): string {
  const { month, day } = readParts(date)
  return `${day}.${month}.`
}

/** Monday=0 … Sunday=6 for the Prague calendar day. */
export function pragueWeekdayIndexMon0(date: Date): number {
  const { year, month, day } = readParts(date)
  // Noon UTC on that civil date avoids DST edge ambiguity for weekday lookup.
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay()
  return weekday === 0 ? 6 : weekday - 1
}

/** Start of the Prague civil day containing `date`, as a UTC instant. */
export function pragueStartOfDay(date: Date = new Date()): Date {
  const { year, month, day } = readParts(date)
  return combinePragueDateTime(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, '00:00')!
}

/**
 * Interpret `yyyy-MM-dd` + `HH:mm` as Europe/Prague wall time and return the UTC Date.
 * Same offset-trick behaviour as the previous admin helper.
 */
export function combinePragueDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  const [year, month, day] = dateStr.split('-').map(Number)
  if ([hours, minutes, year, month, day].some((n) => Number.isNaN(n))) return null

  const localAsIf = new Date(year, month - 1, day, hours, minutes)
  const asPragueWall = new Date(localAsIf.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  const offset = localAsIf.getTime() - asPragueWall.getTime()
  return new Date(localAsIf.getTime() + offset)
}

interface CalendarDisplaySlot {
  time: string
  available: boolean
}

export interface CalendarDisplayDay {
  day: string
  date: string
  slots: CalendarDisplaySlot[]
  isToday: boolean
}

export interface MapSlotsInput {
  date: Date
  reserved: boolean
}

/**
 * Pure transform used by the public booking calendar.
 * Groups slots by Prague day, drops past days, sorts times.
 */
export function mapApiDataToDisplay(
  apiData: MapSlotsInput[] | { data: MapSlotsInput[] } | unknown,
  dayNames: readonly string[],
  now: Date = new Date(),
): CalendarDisplayDay[] {
  if (!apiData) {
    return []
  }

  let slots: MapSlotsInput[]
  if (
    typeof apiData === 'object' &&
    apiData !== null &&
    'data' in apiData &&
    Array.isArray((apiData as { data: MapSlotsInput[] }).data)
  ) {
    slots = (apiData as { data: MapSlotsInput[] }).data
  } else if (Array.isArray(apiData)) {
    slots = apiData
  } else {
    return []
  }

  if (slots.length === 0) {
    return []
  }

  const todayKey = pragueDayKey(now)
  const slotsByDay = new Map<string, MapSlotsInput[]>()

  for (const slot of slots) {
    const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date)
    if (Number.isNaN(slotDate.getTime())) continue
    const dayKey = pragueDayKey(slotDate)
    if (!slotsByDay.has(dayKey)) {
      slotsByDay.set(dayKey, [])
    }
    slotsByDay.get(dayKey)!.push({ ...slot, date: slotDate })
  }

  return Array.from(slotsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([dayKey]) => dayKey >= todayKey)
    .map(([dayKey, daySlots]) => {
      const first = daySlots[0].date
      const dayName = dayNames[pragueWeekdayIndexMon0(first)]
      const dateStr = pragueDisplayDate(first)
      const isToday = dayKey === todayKey

      const dayDisplaySlots = daySlots
        .map((slot) => ({
          time: pragueTimeInput(slot.date),
          available: !slot.reserved,
        }))
        .sort((a, b) => {
          const [aHours, aMinutes] = a.time.split(':').map(Number)
          const [bHours, bMinutes] = b.time.split(':').map(Number)
          if (aHours !== bHours) return aHours - bHours
          return aMinutes - bMinutes
        })

      return {
        day: dayName,
        date: dateStr,
        slots: dayDisplaySlots,
        isToday,
      }
    })
}
