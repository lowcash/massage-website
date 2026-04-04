import dynamic from 'next/dynamic'

import { getCalendar } from '@/app/actions/calendar'
import type { CalendarSlot } from '@/src/components/features/Calendar'

import Navigation from '@/src/components/layout/Navigation'
import Hero from '@/src/components/features/Hero'

// Below-fold sections — loaded asynchronously after hero renders
const Services = dynamic(() => import('@/src/components/features/Services'))
const GiftVouchers = dynamic(() => import('@/src/components/features/GiftVouchers'))
const About = dynamic(() => import('@/src/components/features/About'))
const Gallery = dynamic(() => import('@/src/components/features/Gallery'))
const Calendar = dynamic(() => import('@/src/components/features/Calendar'))
const Contact = dynamic(() => import('@/src/components/features/Contact'))
const Footer = dynamic(() => import('@/src/components/layout/Footer'))

const ScrollToTop = dynamic(() => import('@/src/components/layout/ScrollToTop'))
const WhatsAppButton = dynamic(() => import('@/src/components/shared/WhatsAppButton'))
const Toaster = dynamic(() => import('@/src/components/ui/sonner').then((module) => module.Toaster))

export const revalidate = 60

export default async function Page() {
  const result = await getCalendar()
  // Server action with next-safe-action returns: { data: { success, data }, ... }
  const actionData = result?.data
  const rawData = actionData?.data ?? []
  // Filter out any null values and ensure proper types
  const calendarData: CalendarSlot[] = Array.isArray(rawData)
    ? rawData.filter((slot): slot is CalendarSlot => slot !== null)
    : []

  return (
    <>
      <Navigation />
      <Hero />
      <Services />
      <GiftVouchers />
      <About />
      <Gallery />
      <Calendar data={calendarData} />
      <Contact />
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
      <Toaster />
    </>
  )
}
