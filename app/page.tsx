// import calendarData from '@/data/calendar.json'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
// import Calendar from '@/components/Calendar'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default async function Page() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      {/* <Calendar data={calendarData} /> */}
      <About />
      <Contact />
      <Footer />
    </>
  )
}
