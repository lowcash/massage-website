'use client'

import React from 'react'
import * as Helper from '@/app/_components/Calendar/index.helper'

import Calendar, { type CalendarProps } from '@/app/_components/Calendar/Calendar'

interface CalendarSliderProps extends CalendarProps {
  visibleDays?: number // Počet dní viditelných na jedné stránce
  totalDaysToLoad?: number // Celkový počet dní, které chceme načíst
}

export default function CalendarSlider({
  appointments,
  currentDate = new Date(),
  visibleDays = 5,
  totalDaysToLoad = 14, // Načteme např. 14 dní dopředu
  onSelect,
}: CalendarSliderProps) {
  // State pro aktuální offset stránky
  const [pageOffset, setPageOffset] = React.useState(0)

  // Nastavíme aktuální datum (bez času)
  const todayDate = new Date(currentDate)
  todayDate.setHours(0, 0, 0, 0)

  // Spočítáme, kolik stránek máme celkem
  const totalPages = Math.ceil(totalDaysToLoad / visibleDays)

  // Vytvoříme všechny datumy, které chceme zobrazit
  const allDates: Date[] = []
  for (let i = 0; i < totalDaysToLoad; i++) {
    const date = new Date(todayDate)
    date.setDate(todayDate.getDate() + i)
    allDates.push(date)
  }

  // Filtrujeme termíny jen na ty, které spadají do našeho rozsahu dat
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.value)
    aptDate.setHours(0, 0, 0, 0)

    // Najdeme první a poslední datum našeho rozsahu
    const firstDate = allDates[0]
    const lastDate = allDates[allDates.length - 1]

    // Vrátíme jen termíny v rozsahu
    return aptDate >= firstDate && aptDate <= lastDate
  })

  // Vypočítáme, které datumy patří na aktuální stránku
  const visibleDates = allDates.slice(
    pageOffset * visibleDays,
    Math.min((pageOffset + 1) * visibleDays, allDates.length)
  )

  // Ořežeme termíny jen na ty, které spadají do aktuálně zobrazovaných dat
  const visibleAppointments = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.value)
    aptDate.setHours(0, 0, 0, 0)

    return visibleDates.some((date) => Helper.getDateKey(date) === Helper.getDateKey(aptDate))
  })

  // Funkce pro přechod na předchozí/další stránku
  const prevPage = () => {
    if (pageOffset > 0) {
      setPageOffset(pageOffset - 1)
    }
  }

  const nextPage = () => {
    if (pageOffset < totalPages - 1) {
      setPageOffset(pageOffset + 1)
    }
  }

  return (
    <div className='relative max-w-5xl mx-auto'>
      {/* Šipka doleva */}
      <button
        onClick={prevPage}
        disabled={pageOffset === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12   
                    bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center  
                    ${pageOffset === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label='Předchozí dny'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Kalendář */}
      <Calendar
        appointments={visibleAppointments}
        currentDate={todayDate}
        daysToShow={visibleDays}
        onSelect={onSelect}
      />

      {/* Šipka doprava */}
      <button
        onClick={nextPage}
        disabled={pageOffset >= totalPages - 1}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12  
                    bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center  
                    ${
                      pageOffset >= totalPages - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
        aria-label='Další dny'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Indikátor stránek */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-4 space-x-1'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPageOffset(index)}
              className={`w-2 h-2 rounded-full ${index === pageOffset ? 'bg-blue-500' : 'bg-gray-300'}`}
              aria-label={`Stránka ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
