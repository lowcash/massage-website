// import { headers } from 'next/headers'
// import { UAParser } from 'ua-parser-js'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Calendar from '@/components/Calendar'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default async function Page() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Calendar />
      <About />
      <Contact />
      <Footer />
    </>
  )

  // const userAgent = navigator.userAgent ?? (await headers()).get('user-agent')

  // const { device } = UAParser(userAgent)

  // return (
  //   <>
  //     <Nav />

  //     <main className='flex min-h-screen flex-col gap-24 bg-gray-50'>
  //       <Hero deviceType={device.type ?? 'desktop'} />
  //       <Services />
  //       <Calendar />
  //       <About />
  //       <Contact />

  //       <Footer />
  //     </main>
  //   </>
  // )
}
