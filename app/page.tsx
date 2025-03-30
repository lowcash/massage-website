import React from 'react'

import Nav from '@/app/_components/Nav'
import Hero from '@/app/_components/Hero'
import Services from '@/app/_components/Services'
import Calendar from '@/app/_components/Calendar'
import About from '@/app/_components/About'
import Contact from '@/app/_components/Contact'
import Footer from '@/app/_components/Footer'

export default function Page() {
  return (
    <>
      <Nav />

      <main className='bg-gray-50 min-h-screen gap-24 flex flex-col'>
        <Hero />
        <Services />
        <Calendar />
        <About />
        <Contact />

        <Footer />
      </main>
    </>
  )
}
