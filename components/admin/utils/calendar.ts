import { CalendarItem } from '@/types/calendar'
import { dateToInput, formatDateTime, timeToInput } from '@/lib/utils'

export function combineDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  
  // Interpret the input time as Prague time regardless of user's location
  // Find the UTC timestamp that corresponds to the given time in Prague
  
  const [hours, minutes] = timeStr.split(':').map(Number)
  
  // Create a reference date (today) and set it to the desired Prague time
  const reference = new Date()
  reference.setHours(hours, minutes, 0, 0)
  
  // Get what this time looks like in Prague
  const pragueTime = new Date(reference.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  
  // Calculate the difference between reference time and Prague time
  const diff = reference.getTime() - pragueTime.getTime()
  
  // Create the target date with the input date
  const [year, month, day] = dateStr.split('-').map(Number)
  const targetDate = new Date(year, month - 1, day, hours, minutes)
  
  // Adjust by the timezone difference
  return new Date(targetDate.getTime() - diff)
}

export function isDateTimeInFuture(dateObj: Date | null): boolean {
  if (!dateObj) return false
  return dateObj.getTime() > Date.now()
}

export function getDefaultDateString(date: Date) {
  return dateToInput(date)
}

export function getDefaultTimeString(date: Date) {
  // Convert to Prague timezone for display
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  pragueDate.setSeconds(0, 0)
  let min = Math.round(pragueDate.getMinutes() / 5) * 5
  if (min === 60) {
    pragueDate.setHours(pragueDate.getHours() + 1)
    min = 0
  }
  pragueDate.setMinutes(min)
  const hours = String(pragueDate.getHours()).padStart(2, '0')
  const minutes = String(pragueDate.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function sortCalendarList(input: CalendarItem[]): CalendarItem[] {
  return [...input].sort((a, b) => {
    const aPrague = new Date(a.date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    const bPrague = new Date(b.date.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    return aPrague.getTime() - bPrague.getTime()
  })
}

export function filterFutureCalendarItems(items: CalendarItem[]): CalendarItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return items.filter((x) => x.date > today)
}
