'use client'

import { useScrollToElement } from '@/hooks/useScrollToElement'

import { SECTION } from '@/const'

export default function HeroCTA() {
  const scrollToCalendar = useScrollToElement()

  return (
    <>
      <button
        onClick={() => scrollToCalendar(SECTION.SERVICES.id)}
        className='animate-slide-up relative z-10 overflow-hidden rounded-full border border-white px-8 py-3 text-sm font-medium tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-gray-200/10'
      >
        Vyberte si masáž
      </button>
    </>
  )
}
