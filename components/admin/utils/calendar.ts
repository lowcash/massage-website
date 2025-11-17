import { CalendarItem } from '@/types/calendar'
import { dateToInput, formatDateTime, timeToInput } from '@/lib/utils'

export function combineDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const result = new Date(`${dateStr}T${timeStr}`)
  return isNaN(result.getTime()) ? null : result
}

export function isDateTimeInFuture(dateObj: Date | null): boolean {
  if (!dateObj) return false
  return dateObj.getTime() > Date.now()
}

export function getDefaultDateString(date: Date) {
  return dateToInput(date)
}

export function getDefaultTimeString(date: Date) {
  date.setSeconds(0, 0)
  let min = Math.round(date.getMinutes() / 5) * 5
  if (min === 60) {
    date.setHours(date.getHours() + 1)
    min = 0
  }
  date.setMinutes(min)
  return date.toTimeString().slice(0, 5)
}

export function sortCalendarList(input: CalendarItem[]): CalendarItem[] {
  return [...input].sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function filterFutureCalendarItems(items: CalendarItem[]): CalendarItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return items.filter((x) => x.date > today)
}
