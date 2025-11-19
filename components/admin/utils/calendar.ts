import { CalendarItem } from '@/types/calendar'
import { dateToInput, formatDateTime, timeToInput } from '@/lib/utils'

export function combineDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  const [year, month, day] = dateStr.split('-').map(Number)
  
  // Vytvoříme datum v Prague timezone a převedeme na UTC
  // Uživatel zadá např. 15:00 Prague → uloží se jako 14:00 UTC
  const pragueDate = new Date(year, month - 1, day, hours, minutes)
  const utcString = pragueDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' })
  const parsedUtc = new Date(utcString)
  const offset = pragueDate.getTime() - parsedUtc.getTime()
  
  return new Date(pragueDate.getTime() + offset)
}

export function isDateTimeInFuture(dateObj: Date | null): boolean {
  if (!dateObj) return false
  return dateObj.getTime() > Date.now()
}

export function getDefaultDateString(date: Date) {
  return dateToInput(date)
}

export function getDefaultTimeString(date: Date) {
  // Zobrazí čas v Prague timezone
  return timeToInput(date)
}

export function sortCalendarList(input: CalendarItem[]): CalendarItem[] {
  // Řadí podle Prague timezone
  return [...input].sort((a, b) => {
    const aPrague = new Date(a.date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    const bPrague = new Date(b.date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    return aPrague.getTime() - bPrague.getTime()
  })
}

export function filterFutureCalendarItems(items: CalendarItem[]): CalendarItem[] {
  // Aktuální datum v Prague timezone (začátek dne)
  const now = new Date()
  const nowPrague = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  nowPrague.setHours(0, 0, 0, 0)
  
  return items.filter((item) => {
    const itemPrague = new Date(item.date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    return itemPrague >= nowPrague
  })
}
