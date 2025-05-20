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
  // const calendarData = (await getCalendar())?.data

  return (
    <>
      <Header />
      <Hero />
      <Services />
      {/* {calendarData && <Calendar data={calendarData} />} */}
      <About />
      <Contact />
      <Footer />
    </>
  )
}
