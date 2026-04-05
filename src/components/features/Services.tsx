'use client'

import {
  Activity,
  AlignCenter,
  Baby,
  Brain,
  Droplet,
  Footprints,
  HandMetal,
  Heart,
  Scissors,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ServiceItem } from '@/lib/content'
import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useBooking } from '@/src/contexts/BookingContext'
import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

function ServiceCard({
  service,
  Icon,
  delayMs,
  isVisible,
  fadeIn,
  hidden,
  onClick,
}: {
  service: ServiceItem
  Icon: LucideIcon
  delayMs: number
  isVisible: boolean
  fadeIn: string
  hidden: string
  onClick: () => void
}) {
  return (
    <div
      className={`${fadeIn} ${!isVisible ? hidden : ''}`}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      <button
        type='button'
        onClick={onClick}
        className='flex h-full w-full cursor-pointer flex-col rounded-2xl border border-[#e7d0cb] bg-white p-6 text-left transition-[translate,box-shadow] duration-[360ms] ease-out hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(113,73,65,0.12)]'
      >
        <div className='mb-4 flex items-start gap-3'>
          <Icon className='mt-0.5 h-[18px] w-[18px] shrink-0 text-[#ca6f61]' />
          <h3
            className='text-[1.45rem] leading-[1.2] text-[#342a28]'
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {applyCzechNbsp(service.name)}
          </h3>
        </div>

        <p className='min-h-28 text-[15px] leading-relaxed text-[#5f4f4b]'>{applyCzechNbsp(service.description)}</p>

        <div className='mt-auto flex items-center justify-between border-t border-[#ecd8d3] pt-4 text-sm'>
          <span className='text-[#78625d]'>
            {applyCzechNbsp(service.duration || siteContent.services.defaultDurationLabel)}
          </span>
          <span className='font-medium text-[#ca6f61]'>{applyCzechNbsp(service.price)}</span>
        </div>
      </button>
    </div>
  )
}

const iconMap = {
  activity: Activity,
  'align-center': AlignCenter,
  baby: Baby,
  brain: Brain,
  droplet: Droplet,
  footprints: Footprints,
  'hand-metal': HandMetal,
  heart: Heart,
  scissors: Scissors,
  sparkles: Sparkles,
  target: Target,
  zap: Zap,
}

export default function Services() {
  const { setSelectedService } = useBooking()
  const shouldReduceMotion = useReducedMotion()
  const intro = useInView()
  const grid = useInView()

  const fadeIn = 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  const hidden = shouldReduceMotion ? '' : 'opacity-0 translate-y-4'

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id='services' className='bg-[#f6edeb] px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <div ref={intro.ref} className={`${fadeIn} ${!intro.inView ? hidden : ''}`}>
          <SectionIntro
            id='services-heading'
            title={siteContent.services.heading}
            subtitle={siteContent.services.subtitle}
            description={siteContent.services.intro}
          />
        </div>

        <div ref={grid.ref} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {siteContent.services.items.map((service, index) => {
            const Icon = iconMap[service.icon]
            const delayMs = shouldReduceMotion ? 0 : (index + 1) * 110

            return (
              <ServiceCard
                key={service.name}
                service={service}
                Icon={Icon}
                delayMs={delayMs}
                isVisible={grid.inView}
                fadeIn={fadeIn}
                hidden={hidden}
                onClick={() => handleServiceClick(service.name)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
