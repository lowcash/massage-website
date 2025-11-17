import { getCalendar } from '@/app/actions/calendar'
import type { CalendarSlot } from '@/src/components/Calendar'

import SignOut from '@/components/SignOut'
import DateTimeSelector from '@/components/DateTimeSelector'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const result = await getCalendar()
  const calendarData: CalendarSlot[] = (result?.data ?? []) as CalendarSlot[]

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-6 p-4'>
      <div className='flex items-center justify-between'>
        <SignOut />
      </div>

      <DateTimeSelector data={calendarData} />
    </div>
  )
}
