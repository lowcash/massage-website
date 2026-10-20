import type { CalendarSlot } from '@/src/components/features/Calendar'
import CleanUrl from '@/src/components/features/admin/CleanUrl'
import DateTimeSelector from '@/src/components/shared/DateTimeSelector'
import SignOut from '@/src/components/shared/SignOut'

import { getCalendar } from '@/app/actions/calendar'

import type { CalendarItem } from '@/types/calendar'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const result = await getCalendar()

  // Extract data from server action result
  // next-safe-action returns: { data: { success, data }, serverError, validationErrors, ... }
  const actionData = result?.data
  const rawData = actionData?.data ?? []
  // Filter out any null values and ensure proper types
  const slots: CalendarSlot[] = Array.isArray(rawData)
    ? rawData.filter((slot): slot is CalendarSlot => slot !== null)
    : []

  // Filter out past events (keep today and future)
  // Use Prague timezone for consistent filtering
  const today = new Date()
  const todayPrague = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
  todayPrague.setHours(0, 0, 0, 0)

  // Transform CalendarSlot to CalendarItem and filter
  // Dates are already Date objects from Redis, will display in local timezone
  const calendarData: CalendarItem[] = slots
    .filter((slot) => {
      const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date)
      // Convert slot date to Prague timezone for comparison
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
      slotPrague.setHours(0, 0, 0, 0)

      return slotPrague >= todayPrague
    })
    .map((slot) => ({
      date: slot.date instanceof Date ? slot.date : new Date(slot.date),
      reserved: slot.reserved,
    }))

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10'>
      <CleanUrl />

      <header className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-brand text-xs tracking-[0.22em] uppercase'>Administrace</p>
          <h1 className='font-display text-ink text-4xl'>Správa termínů</h1>
        </div>
        <SignOut />
      </header>

      <DateTimeSelector data={calendarData} />
    </div>
  )
}
