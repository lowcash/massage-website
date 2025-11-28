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
  
  // Filter out past events (keep today and future)
  // Use Prague timezone for consistent filtering
  const today = new Date()
  const todayPrague = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  todayPrague.setHours(0, 0, 0, 0)

  // Transform CalendarSlot to CalendarItem and filter
  // Dates are already Date objects from Redis, will display in local timezone
  const calendarData: CalendarItem[] = slots
    .filter(slot => {
      const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date)
      // Convert slot date to Prague timezone for comparison
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
      slotPrague.setHours(0, 0, 0, 0)
      
      return slotPrague >= todayPrague
    })
    .map(slot => ({
      date: slot.date instanceof Date ? slot.date : new Date(slot.date),
      reserved: slot.reserved
    }))

  return (
    <div className='flex flex-col h-screen w-full max-w-4xl mx-auto p-4 gap-4'>
      <div className='flex items-center justify-between flex-shrink-0'>
        <h1 className='text-2xl font-semibold text-[#de397e]' style={{ fontFamily: 'Dancing Script' }}>
          Administrace
        </h1>
        <SignOut />
      </div>

      <div className='flex-1 overflow-hidden'>
        <DateTimeSelector data={calendarData} />
      </div>
    </div>
  )
}
