import { getCalendar } from '@/app/actions/calendar'
import type { CalendarSlot } from '@/src/components/Calendar'

import ScrollProgress from '@/src/components/ScrollProgress'
import Navigation from '@/src/components/Navigation'
import Hero from '@/src/components/Hero'
import Services from '@/src/components/Services'
import About from '@/src/components/About'
import Testimonials from '@/src/components/Testimonials'
import Calendar from '@/src/components/Calendar'
import Contact from '@/src/components/Contact'
import Footer from '@/src/components/Footer'
import SideDots from '@/src/components/SideDots'
import SwipeNavigation from '@/src/components/SwipeNavigation'
import ScrollToTop from '@/src/components/ScrollToTop'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import { Toaster } from '@/components/ui/sonner'

export const revalidate = 60

export default async function Page() {
  const result = await getCalendar()
  // Server action with next-safe-action returns: { data: { success, data }, ... }
  const actionData = result?.data
  const rawData = actionData?.data ?? []
  // Filter out any null values and ensure proper types
  const calendarData: CalendarSlot[] = Array.isArray(rawData) ? rawData.filter((slot): slot is CalendarSlot => slot !== null) : []

  return (
    <>
      <ScrollProgress />
      <SwipeNavigation />
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Calendar data={calendarData} />
      <Contact />
      <Footer />
      <SideDots />
      <ScrollToTop />
      <WhatsAppButton />
      <Toaster />
    </>
  )
}
