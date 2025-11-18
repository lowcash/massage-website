import { getCalendar } from '@/app/actions/calendar'
import type { CalendarSlot } from '@/src/components/Calendar'
import type { CalendarItem } from '@/types/calendar'

import SignOut from '@/components/SignOut'
import DateTimeSelector from '@/components/DateTimeSelector'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const result = await getCalendar()
  
  // Extract data from server action result
  // next-safe-action returns: { data: { success, data }, serverError, validationErrors, ... }
  const actionData = result?.data
  const rawData = actionData?.data ?? []
  // Filter out any null values and ensure proper types
  const slots: CalendarSlot[] = Array.isArray(rawData) ? rawData.filter((slot): slot is CalendarSlot => slot !== null) : []
  
  // Transform CalendarSlot to CalendarItem
  // Dates are already Date objects from Redis, will display in local timezone
  const calendarData: CalendarItem[] = slots.map(slot => ({
    date: slot.date instanceof Date ? slot.date : new Date(slot.date),
    reserved: slot.reserved
  }))

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-6 p-4'>
      <div className='flex items-center justify-between'>
        <SignOut />
      </div>

      <DateTimeSelector data={calendarData} />
    </div>
  )
}
