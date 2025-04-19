'use client'

import React from 'react'

import { TitleSection } from '@/components/ui/typo'
import { type Appointment } from '@/app/_components/Calendar/Calendar'
import CalendarSlider from '@/app/_components/Calendar/Slider'

import { SECTIONS } from '@/config'

export default function Calendar() {
  // Fixní datum pro demo - 29.3.2025
  const fixedDate = new Date(2025, 2, 29)

  // Vytvoříme termíny pro 14 dní
  const appointments: Appointment[] = []

  for (let i = 0; i < 14; i++) {
    const date = new Date(2025, 2, 29)
    date.setDate(date.getDate() + i)

    // Víkendy mají více termínů
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    // const startHour = isWeekend ? 9 : 12
    // const endHour = isWeekend ? 18 : 19

    const startHour = 14
    const endHour = 18

    // Vytvoříme termíny pro daný den
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        // Náhodně označíme některé termíny jako nedostupné (častěji v blízké budoucnosti)
        const daysFuture = i + 1
        const chanceOfAvailability = Math.min(0.3 + daysFuture * 0.05, 0.8)
        const isAvailable = Math.random() < chanceOfAvailability

        appointments.push({
          value: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute),
          status: isAvailable ? 'available' : 'unavailable',
        })
      }
    }
  }

  // Funkce pro výběr termínu
  const handleAppointmentSelect = () => {
    // TODO
  }

  return (
    <section id={SECTIONS[1].id} className='mx-auto w-full max-w-5xl rounded-lg bg-white p-5 shadow-lg'>
      <TitleSection>{SECTIONS[1].header}</TitleSection>

      <CalendarSlider
        appointments={appointments}
        currentDate={fixedDate}
        visibleDays={5}
        totalDaysToLoad={14}
        onSelect={handleAppointmentSelect}
      />
    </section>
  )
}
