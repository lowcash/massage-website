'use client'

import { useMemo, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useScrollToElement } from '@/hooks/use-scroll-to-element'
import { useIsClient } from '@/hooks/use-is-cllient'

import { Description, H2 } from '@/style/typo'
import { SectionHeaderContainer } from '@/style/common'

import { PHONE, SECTION } from '@/const'

const VISIBLE_DESKTOP_DAYS = 4
const VISIBLE_MOBILE_DAYS = 3

export interface CalendarSlot {
  date: Date
  reserved: boolean
}

interface Props {
  data: CalendarSlot[]
}

export default function Calendar(p: Props) {
  const [activePage, setActivePage] = useState(0)

  const scrollToContact = useScrollToElement()
  const visibleDays = useVisibleDays()

  const isClient = useIsClient()

  const data = useMemo(() => {
    if (!isClient) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return p.data.filter((x) => x.date > today)
  }, [isClient, p.data])

  // Skupiny slotů podle dne
  const groupedDays = groupSlotsByDay(data)
  const totalPages = Math.ceil(groupedDays.length / visibleDays)
  const visibleDaysData = groupedDays.slice(activePage, activePage + visibleDays)

  const hasMorePages = totalPages > 1

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
        <SectionHeaderContainer>
          <H2>Najděte si volný termín</H2>
          <Description
            dangerouslySetInnerHTML={{
              __html: `Termíny jsou pouze orientační. Pro&nbsp;rezervaci volejte nebo napište SMS: <strong class='whitespace-nowrap'>${PHONE}</strong>`,
            }}
          />
        </SectionHeaderContainer>

        <div className='calendar-container relative mx-auto max-w-4xl'>
          {hasMorePages && (
            <button
              className='text-bc6290 hover:text-studio-gold absolute top-1/2 left-0 z-10 translate-x-3 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:translate-x-3'
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
          )}

          <div className='calendar-scroll-area'>
            <div className='flex justify-center gap-4'>
              {visibleDaysData.map((dayGroup, dayIndex) => (
                <div key={dayIndex} className='max-w-40 flex-1'>
                  <div
                    className={`h-full rounded-2xl bg-white p-4 shadow-sm transition-all ${isToday(dayGroup.day) ? 'current-day' : ''}`}
                  >
                    <div
                      className={`mb-3 border-b pb-2 text-center ${isToday(dayGroup.day) ? 'border-bc6290' : 'border-gray-100'}`}
                    >
                      <p
                        className={`text-sm font-medium md:text-lg ${isToday(dayGroup.day) ? 'text-bc6290' : 'text-gray-700'}`}
                      >
                        {formatDay(dayGroup.day)}
                        <br />
                        {formatDate(dayGroup.day)}
                      </p>
                    </div>

                    {dayGroup.slots.length > 0 ? (
                      <div className='flex flex-col items-center space-y-2' style={{ minHeight: `${500}px` }}>
                        {dayGroup.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className={`time-block flex w-full justify-center ${slot.reserved ? 'time-block-unavailable' : 'time-block-available'}`}
                            onClick={() => {
                              if (slot.reserved) return

                              scrollToContact(SECTION.CONTACT.id)
                            }}
                          >
                            <span>{formatTime(slot.date)}</span>
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

          {hasMorePages && (
            <button
              className='text-bc6290 hover:text-studio-gold absolute top-1/2 right-0 z-10 -translate-x-3 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:-translate-x-3'
              onClick={() => handleNavigation('next')}
              disabled={activePage === totalPages - 1}
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
          )}
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

        <div className='mx-auto mt-8 flex max-w-2xl flex-col gap-1 text-center'>
          <p className='text-gray-600 italic'>
            Kalendář slouží pouze pro informaci, rezervace je platná až&nbsp;po osobním potvrzení telefonem.
          </p>

          <p className='text-gray-500'>
            Termíny aktualizuji manuálně&nbsp;– děkuji za&nbsp;pochopení a&nbsp;trpělivost!
          </p>
        </div>
      </div>
    </section>
  )
}

function useVisibleDays() {
  const isMobile = useIsMobile()

  return isMobile ? VISIBLE_MOBILE_DAYS : VISIBLE_DESKTOP_DAYS
}

// Pomocná funkce pro zobrazení pouze dne (pro záhlaví sloupce)
function formatDay(date: Date) {
  return isToday(date) ? 'Dnes' : isTommorrow(date) ? 'Zítra' : date.toLocaleDateString('cs-CZ', { weekday: 'long' })
}

function formatDate(date: Date) {
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
  })
}

// Pomocná funkce pro zobrazení pouze času
function formatTime(date: Date) {
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Vrací true, pokud je slot v dnešním dni
function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isTommorrow(date: Date) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  )
}

// Skupina slotů podle dne (ignoruje čas)
function groupSlotsByDay(slots: CalendarSlot[]) {
  const map = new Map<string, CalendarSlot[]>()
  slots.forEach((slot) => {
    const yyyy = slot.date.getFullYear()
    const mm = String(slot.date.getMonth() + 1).padStart(2, '0')
    const dd = String(slot.date.getDate()).padStart(2, '0')
    const dayKey = `${yyyy}-${mm}-${dd}`

    if (!map.has(dayKey)) map.set(dayKey, [])
    map.get(dayKey)!.push(slot)
  })
  return Array.from(map.entries()).map(([dayKey, slots]) => ({
    day: slots[0].date,
    slots,
  }))
}
