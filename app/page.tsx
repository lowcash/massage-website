import { getCalendar } from '@/app/actions/calendar'

import ScrollProgress from '@/components/ScrollProgress'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
// import Testimonials from '@/components/Testimonials'
import Calendar from '@/components/Calendar'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import SideDots from '@/components/SideDots'
import ScrollToTop from '@/components/ScrollToTop'
import WhatsAppButton from '@/components/WhatsAppButton'

export const revalidate = 60

export default async function Page() {
  const calendarData = (await getCalendar())?.data

  return (
    <>
            <ScrollProgress />
      <Header />
      <Hero />
      <Services />
      <About />
      {/* <Testimonials /> */}
      {calendarData && <Calendar data={calendarData} />}
      <FAQ />
      <Contact />
      <Footer />
      <SideDots />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  )
}
