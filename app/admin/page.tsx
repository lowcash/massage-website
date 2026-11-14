import type { CalendarSlot } from '@/src/components/features/Calendar'
import CleanUrl from '@/src/components/features/admin/CleanUrl'
import { filterFutureCalendarItems } from '@/src/components/features/admin/utils/calendar'
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

  // Dates are Date objects from Redis; drop past Prague days (keep today and future).
  const calendarData: CalendarItem[] = filterFutureCalendarItems(
    slots.map((slot) => ({
      date: slot.date instanceof Date ? slot.date : new Date(slot.date),
      reserved: slot.reserved,
    })),
  )

  return (
    <main
      id='main-content'
      className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10'
    >
      <CleanUrl />

      <header className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-brand text-xs tracking-[0.22em] uppercase'>Administrace</p>
          <h1 className='font-display text-ink text-4xl'>Správa termínů</h1>
        </div>
        <SignOut />
      </header>

      <DateTimeSelector data={calendarData} />
    </main>
  )
}
