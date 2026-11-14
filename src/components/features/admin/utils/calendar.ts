import { combinePragueDateTime, pragueDayKey } from '@/lib/prague-time'

import { CalendarItem } from '@/types/calendar'

export function combineDateTime(dateStr: string, timeStr: string): Date | null {
  return combinePragueDateTime(dateStr, timeStr)
}

export function isDateTimeInFuture(dateObj: Date | null): boolean {
  if (!dateObj) return false
  return dateObj.getTime() > Date.now()
}

export function sortCalendarList(input: CalendarItem[]): CalendarItem[] {
  return [...input].sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function filterFutureCalendarItems(items: CalendarItem[]): CalendarItem[] {
  const todayKey = pragueDayKey(new Date())
  return items.filter((item) => {
    if (Number.isNaN(item.date.getTime())) return false
    return pragueDayKey(item.date) >= todayKey
  })
}
