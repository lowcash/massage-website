'use client'

import BookingCalendar from './BookingCalendar'

export interface CalendarSlot {
  date: Date
  reserved: boolean
}

interface Props {
  data: CalendarSlot[]
}

export default function Calendar({ data }: Props) {
  return <BookingCalendar />
}
