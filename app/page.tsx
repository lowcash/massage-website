import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

import Nav from '@/app/_components/Nav'
import Hero from '@/app/_components/Hero'
import Services from '@/app/_components/Services'
import Calendar from '@/app/_components/Calendar'
import About from '@/app/_components/About'
import Contact from '@/app/_components/Contact'
import Footer from '@/app/_components/Footer'

export default async function Page() {
  const userAgent = navigator.userAgent ?? (await headers()).get('user-agent')

  const { device } = UAParser(userAgent)

  return (
    <>
      <Nav />

      <main className='flex min-h-screen flex-col gap-24 bg-gray-50'>
        <Hero deviceType={device.type ?? 'desktop'} />
        <Services />
        <Calendar />
        <About />
        <Contact />

        <Footer />
      </main>
    </>
  )
}
