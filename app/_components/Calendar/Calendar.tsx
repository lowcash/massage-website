import * as Helper from '@/app/_components/Calendar/index.helper'

// Základní typy
type AppointmentStatus = 'available' | 'unavailable'

export interface Appointment {
  value: Date
  status?: AppointmentStatus
}

export interface CalendarProps {
  appointments: Appointment[]
  currentDate?: Date
  daysToShow?: number
  onSelect?: (appointment: Appointment) => void
}

export default function Calendar({
  appointments,
  currentDate = new Date(),
  daysToShow = 5,
  onSelect = (apt) => alert(`Vybráno: ${Helper.formatDate(apt.value)} ${Helper.formatTime(apt.value)}`),
}: CalendarProps) {
  // Seskupíme termíny podle dnů
  const groupedByDay: Record<string, Appointment[]> = {}

  appointments.forEach((apt) => {
    // Vytvoříme klíč pro den
    const dayKey = Helper.getDateKey(apt.value)

    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = []
    }

    groupedByDay[dayKey].push(apt)
  })

  // Vytvoříme pole dnů s jejich termíny
  const days = Object.entries(groupedByDay)
    .map(([dayKey, dayAppointments]) => {
      // Rozdělíme klíč zpět na komponenty
      const [yearStr, monthStr, dayStr] = dayKey.split('-')
      const date = new Date(parseInt(yearStr), parseInt(monthStr), parseInt(dayStr))

      return {
        date,
        dayName: Helper.getDayName(date, currentDate),
        dateLabel: Helper.formatDate(date),
        appointments: dayAppointments.sort((a, b) => a.value.getTime() - b.value.getTime()),
      }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, daysToShow)

  return (
    <>
      {days.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5'>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className='text-center'>
              <div className={`mb-3 font-medium ${day.dayName === 'Dnes' ? 'text-[var(--pink)]' : 'text-gray-700'}`}>
                {day.dayName} <br />
                <span className='text-sm text-gray-500'>{day.dateLabel}</span>
              </div>

              <div className='space-y-2'>
                {day.appointments.map((apt, aptIndex) => (
                  // <button key={aptIndex} onClick={() => apt.status === 'available' && onSelect(apt)}>ABCD</button>
                  <button
                    key={aptIndex}
                    className={`relative w-full rounded-md py-2 text-sm font-medium transition-all duration-300 bg-blue-200 text-blue-600 hover:bg-blue-300`}
                    // disabled={apt.status === 'unavailable'}
                    // onClick={() => apt.status === 'available' && onSelect(apt)}
                    // className={`relative w-full rounded-md py-2 text-sm font-medium transition-all duration-300 ${
                    //   apt.status === 'unavailable'
                    //     ? 'cursor-not-allowed text-gray-400 line-through'
                    //     : 'bg-blue-200 text-blue-600 hover:bg-blue-300'
                    // } `}
                  >
                    {Helper.formatTime(apt.value)}
                  </button>
                ))}

                {day.appointments.length === 0 && <div className='py-2 text-gray-400'>Žádné termíny</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='py-8 text-center text-gray-500'>Žádné termíny k dispozici</div>
      )}
    </>
  )
}
