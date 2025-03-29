import React from 'react'
import * as Helper from '@/app/_components/Calendar/index.helper'

import { type Appointment } from '@/app/_components/Calendar/Calendar'
import CalendarSlider from '@/app/_components/Calendar/Slider'

// Ukázka použití
export default function CalendarDemo() {
  // Fixní datum pro demo - 29.3.2025
  const fixedDate = new Date(2025, 2, 29)

  // Vytvoříme velké množství termínů pro 14 dní
  const appointments: Appointment[] = []

  // Vygenerujeme termíny pro 14 dní
  for (let i = 0; i < 14; i++) {
    const date = new Date(2025, 2, 29)
    date.setDate(date.getDate() + i)

    // Pro každý den 3-6 termínů
    const numSlots = 3 + Math.floor(Math.random() * 4)

    for (let j = 0; j < numSlots; j++) {
      // Časy od 9:00 do 17:00
      const hour = 9 + Math.floor(Math.random() * 8)
      const minute = Math.random() > 0.5 ? 0 : 30

      // Některé termíny jsou nedostupné
      const isAvailable = Math.random() > 0.4

      appointments.push({
        value: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute),
        status: isAvailable ? 'available' : 'unavailable',
      })
    }
  }

  // Seřadíme termíny podle času
  appointments.sort((a, b) => a.value.getTime() - b.value.getTime())

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-center mb-8'>Kalendář termínů s posuvnými šipkami</h1>

      <CalendarSlider
        appointments={appointments}
        currentDate={fixedDate}
        visibleDays={5}
        totalDaysToLoad={14}
        onSelect={(apt) =>
          alert(`Vybrali jste termín: ${Helper.formatDate(apt.value)} ${Helper.formatTime(apt.value)}`)
        }
      />
    </div>
  )
}
