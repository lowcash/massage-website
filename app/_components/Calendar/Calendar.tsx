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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className='text-center'>
              {/* Hlavička dne */}
              <div className={`font-medium mb-3 ${day.dayName === 'Dnes' ? 'text-pink-500' : 'text-gray-700'}`}>
                {day.dayName} <br />
                <span className='text-sm text-gray-500'>{day.dateLabel}</span>
              </div>

              {/* Termíny */}
              <div className='space-y-2'>
                {day.appointments.map((apt, aptIndex) => (
                  <button
                    key={aptIndex}
                    disabled={apt.status === 'unavailable'}
                    onClick={() => apt.status === 'available' && onSelect(apt)}
                    className={`  
                      w-full py-2 rounded-md text-sm transition-all duration-300 relative font-medium  
                      ${
                        apt.status === 'unavailable'
                          ? 'line-through text-gray-400 cursor-not-allowed'
                          : 'bg-blue-200 text-blue-600 hover:bg-blue-300'
                      }  
                    `}
                  >
                    {Helper.formatTime(apt.value)}
                  </button>
                ))}

                {day.appointments.length === 0 && <div className='text-gray-400 py-2'>Žádné termíny</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center text-gray-500 py-8'>Žádné termíny k dispozici</div>
      )}
    </>
  )
}
