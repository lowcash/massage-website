import BookingCalendar from './BookingCalendar'

export interface CalendarSlot {
  date: Date
  reserved: boolean
}

interface Props {
  data?: CalendarSlot[]
  generatedAt?: string
  demo?: boolean
}

export default function Calendar({ data, generatedAt, demo }: Props) {
  return <BookingCalendar data={data} generatedAt={generatedAt} demo={demo} />
}
