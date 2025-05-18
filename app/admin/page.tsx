import { getCalendar } from '@/app/actions/calendar'

import SignOut from '@/components/SignOut'
import DateTimeSelector from '@/components/DateTimeSelector'

export default async function Admin() {
  const calendarData = (await getCalendar())?.data

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-6 p-4'>
      <div className='flex items-center justify-between'>
        <SignOut />
      </div>

      {/* Spacing between sections is handled by gap-6 above */}
      <DateTimeSelector data={calendarData ?? []} />
    </div>
  )
}
