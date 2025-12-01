import { getCalendar } from '@/app/actions/calendar'
import type { CalendarSlot } from '@/src/components/features/Calendar'

import ScrollProgress from '@/src/components/layout/ScrollProgress'
import Navigation from '@/src/components/layout/Navigation'
import Hero from '@/src/components/features/Hero'
import Services from '@/src/components/features/Services'
import About from '@/src/components/features/About'
// import Testimonials from '@/src/components/features/Testimonials'
import Calendar from '@/src/components/features/Calendar'
import Contact from '@/src/components/features/Contact'
import Footer from '@/src/components/layout/Footer'
import SideDots from '@/src/components/layout/SideDots'
import SwipeNavigation from '@/src/components/layout/SwipeNavigation'
import ScrollToTop from '@/src/components/layout/ScrollToTop'
import WhatsAppButton from '@/src/components/shared/WhatsAppButton'
import { Toaster } from '@/src/components/ui/sonner'

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
      {/* <Testimonials /> */}
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
