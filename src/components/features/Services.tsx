'use client'

import { motion } from 'framer-motion'
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

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'
import { useBooking } from '@/src/contexts/BookingContext'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

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

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id='services' className='bg-[#f6edeb] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='services-heading'
            title={siteContent.services.heading}
            subtitle={siteContent.services.subtitle}
            description={siteContent.services.intro}
          />
        </motion.div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {siteContent.services.items.map((service, index) => {
            const Icon = iconMap[service.icon]

            return (
              <motion.div
                key={service.name}
                {...getAnimationConfigWithDelay(shouldReduceMotion, (index + 1) * 0.1)}
                className='flex h-full cursor-pointer flex-col rounded-2xl border border-[#e7d0cb] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(113,73,65,0.12)]'
                onClick={() => handleServiceClick(service.name)}
              >
                <div className='mb-4 flex items-center gap-3'>
                  <Icon className='h-4 w-4 text-[#ca6f61]' />
                  <h3 className='text-[1.45rem] leading-tight text-[#342a28]' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {service.name}
                  </h3>
                </div>

                <p className='min-h-28 text-[15px] leading-relaxed text-[#5f4f4b]'>
                  {applyCzechNbsp(service.description)}
                </p>

                <div className='mt-auto flex items-center justify-between border-t border-[#ecd8d3] pt-4 text-sm'>
                  <span className='text-[#78625d]'>
                    {service.duration || siteContent.services.defaultDurationLabel}
                  </span>
                  <span className='font-medium text-[#ca6f61]'>{service.price}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}