import { getCalendar } from '@/app/actions/calendar'
import { dateToInput } from '@/lib/utils'

import SignOut from '@/components/SignOut'
import DateTimeSelector from '@/components/DateTimeSelector'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const calendarData = (await getCalendar())?.data

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-6 p-4'>
      <div className='flex items-center justify-between'>
        <SignOut />
      </div>

      <DateTimeSelector
        data={calendarData ?? []}
        defaultDateTime={new Date()}
        // defaultDateString={getDefaultDateString()}
        // defaultTimeString={getDefaultTimeString()}
      />
    </div>
  )
}

// function getDefaultDateString() {
//   const now = new Date()
//   return dateToInput(now)
// }
// function getDefaultTimeString() {
//   const n = new Date()
//   n.setSeconds(0, 0)
//   let min = Math.round(n.getMinutes() / 5) * 5
//   if (min === 60) {
//     n.setHours(n.getHours() + 1)
//     min = 0
//   }
//   n.setMinutes(min)
//   return n.toTimeString().slice(0, 5)
// }
