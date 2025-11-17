import { getCalendar } from '@/app/actions/calendar'

import ScrollProgress from '@/src/components/ScrollProgress'
import Navigation from '@/src/components/Navigation'
import Hero from '@/src/components/Hero'
import Services from '@/src/components/Services'
import About from '@/src/components/About'
import Testimonials from '@/src/components/Testimonials'
import Calendar from '@/src/components/Calendar'
import FAQ from '@/src/components/FAQ'
import Contact from '@/src/components/Contact'
import Footer from '@/src/components/Footer'
import SideDots from '@/src/components/SideDots'
import SwipeNavigation from '@/src/components/SwipeNavigation'
import ScrollToTop from '@/src/components/ScrollToTop'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import { Toaster } from '@/components/ui/sonner'

export const revalidate = 60

export default async function Page() {
  const calendarData = (await getCalendar())?.data

  return (
    <>
      <ScrollProgress />
      <SwipeNavigation />
      <Navigation />
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
      <Toaster />
    </>
  )
}
