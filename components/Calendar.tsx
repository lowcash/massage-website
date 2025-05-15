'use client'

import { useState } from 'react'
import { useScrollToElement } from '@/hooks/useScrollToElement'

import { SECTION } from '@/const'

const calendarData = [
  {
    date: 'po 10. 6.',
    times: [
      { time: '9:00', available: true },
      // { time: '10:00', available: false },
      // { time: '14:00', available: true },
    ],
  },
  {
    date: 'út 11. 6.',
    times: [
      { time: '9:00', available: true },
      { time: '10:00', available: true },
    ],
  },
]

interface Props {
  data: Array<{ date: string; times: Array<{ time: string; available: boolean }> }>
}

export default function Calendar(p: Props) {
  const [activePage, setActivePage] = useState(0)

  const scrollToContact = useScrollToElement()

  const visibleDaysData = p.data?.slice(activePage, activePage + VISIBLE_DAYS)
  const totalPages = Math.ceil((p.data?.length ?? 0) / VISIBLE_DAYS)

  const handleNavigation = (direction: 'prev' | 'next') => {
    switch (direction) {
      case 'prev':
        setActivePage(activePage - 1)
        break
      case 'next':
        setActivePage(activePage + 1)
        break
    }
  }

  return (
    <section id={SECTION.CALENDAR.id} className='bg-studio-beige px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-8 text-center'>
          <h2 className='section-title'>Kalendář</h2>
          <p className='mx-auto max-w-2xl font-sans text-gray-600'>
            Vyberte si volný termín pro vaši relaxační proceduru.
          </p>
        </div>

        <div className='calendar-container relative mx-auto max-w-4xl'>
          <button
            className='text-bc6290 hover:text-studio-gold absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:-translate-x-8'
            onClick={() => handleNavigation('prev')}
            disabled={activePage === 0}
            aria-label='Předchozí týden'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>

          <div className='calendar-scroll-area'>
            <div className='flex justify-center gap-4 py-4'>
              {visibleDaysData?.map((day, dayIndex) => (
                <div key={dayIndex} className='w-40 flex-shrink-0'>
                  <div
                    className={`h-full rounded-2xl bg-white p-4 shadow-sm transition-all ${isToday(day.date) ? 'current-day' : ''}`}
                  >
                    <div
                      className={`mb-3 border-b pb-2 text-center ${isToday(day.date) ? 'border-bc6290' : 'border-gray-100'}`}
                    >
                      <p className={`font-medium ${isToday(day.date) ? 'text-bc6290' : 'text-gray-700'}`}>{day.date}</p>
                    </div>

                    {day.times.length > 0 ? (
                      <div className='flex flex-col items-center space-y-2' style={{ minHeight: `${500}px` }}>
                        {day.times.map((timeObj, timeIndex) => (
                          <div
                            key={timeIndex}
                            className={`time-block flex w-full justify-center ${timeObj.available ? 'time-block-available' : 'time-block-unavailable'}`}
                            onClick={timeObj.available ? () => scrollToContact(SECTION.CONTACT.id) : undefined}
                          >
                            <span>{timeObj.time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='py-4 text-center font-sans text-sm text-gray-400'>Žádné volné termíny</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className='text-bc6290 hover:text-studio-gold absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:translate-x-8'
            onClick={() => handleNavigation('next')}
            disabled={activePage == totalPages - 1}
            aria-label='Další týden'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>

        {/* Page indicator dots */}
        <div className='mt-6 flex justify-center'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`calendar-indicator ${activePage === index ? 'calendar-indicator-active' : ''}`}
              onClick={() => setActivePage(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const VISIBLE_DAYS = 5

// Helper function to get date string
function getDateString(addDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + addDays)
  return date.toLocaleDateString('cs-CZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
}

// Helper to check if date is today
function isToday(dateString: string) {
  const today = new Date().toLocaleDateString('cs-CZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
  return dateString === today
}
