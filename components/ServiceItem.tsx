'use client'

import { useScrollToElement } from '@/hooks/useScrollToElement'

import { SECTION } from '@/const'

interface Props {
  name: string
  icon: React.ReactNode
  description: string
  duration?: string
  price: string
}

export default function ServiceItem(p: Props) {
  const scrollToCalendar = useScrollToElement()

  return (
    <div
      className='group relative flex transform cursor-pointer flex-col items-center overflow-hidden rounded-2xl bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md'
      onClick={() => scrollToCalendar(SECTION.CONTACT.id)}
      aria-label={`Vybrat masáž ${p.name}`}
    >
      <div className='flex h-full flex-col items-center p-10 md:p-12 lg:p-10'>
        <div className='mb-6 transition-transform duration-300 group-hover:rotate-3'>{p.icon}</div>
        <h3 className='text-studio-dark-green mb-3 font-serif text-3xl font-medium transition-colors md:text-2xl'>
          {p.name}
        </h3>
        <p className='text-studio-dark-gray mb-4 font-serif text-lg font-light md:text-sm'>{p.description}</p>
        <div className='mt-auto flex flex-col pt-6'>
          <span className='block font-serif text-2xl text-gray-500 md:text-xl'>{p.duration}</span>
          <span className='text-studio-gold font-serif text-2xl font-medium md:text-xl'>{p.price}</span>
        </div>
      </div>
      <div className='absolute inset-0 bg-white/5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300'></div>
    </div>
  )
}
