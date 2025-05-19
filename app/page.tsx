import { getCalendar } from '@/app/actions/calendar'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Calendar from '@/components/Calendar'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function Page() {
  const calendarData = (await getCalendar())?.data

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return (
    <>
      {today.toUTCString()}&nbsp;
      {today.toISOString()}&nbsp;
      {today.getTimezoneOffset()}
      <br />
      {calendarData?.[0]?.date.toUTCString()}&nbsp;
      {calendarData?.[0]?.date.toISOString()}&nbsp;
      {calendarData?.[0]?.date.getTimezoneOffset()}&nbsp;
      <Header />
      <Hero />
      <Services />
      {calendarData && <Calendar data={calendarData} />}
      <About />
      <Contact />
      <Footer />
    </>
  )
}
