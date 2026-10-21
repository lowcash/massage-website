'use client'

import type { ServiceItem } from '@/lib/content'
import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn, scrollToSection } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useBooking } from '@/src/contexts/BookingContext'
import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

function ServiceRow({
  service,
  delayMs,
  isVisible,
  fadeIn,
  hidden,
  onClick,
}: {
  service: ServiceItem
  delayMs: number
  isVisible: boolean
  fadeIn: string
  hidden: string
  onClick: () => void
}) {
  return (
    <li
      className={`py-1.5 ${fadeIn} ${!isVisible ? hidden : ''}`}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      <button
        type='button'
        onClick={onClick}
        className='group hover:bg-paper focus-visible:bg-paper grid w-full cursor-pointer grid-cols-1 gap-y-1.5 rounded-2xl px-4 py-5 text-left transition-[translate,background-color] duration-360 ease-out hover:translate-x-0.5 md:grid-cols-[1fr_auto] md:gap-x-6 md:px-5'
      >
        <h3 className='font-display text-ink text-[1.55rem] leading-[1.15] font-medium md:col-start-1'>
          {applyCzechNbsp(service.name)}
        </h3>

        <span className='flex items-baseline gap-3 md:col-start-2 md:row-span-2 md:row-start-1 md:flex-col md:items-end md:gap-1 md:pt-1 md:text-right'>
          <span className='text-brand font-medium whitespace-nowrap tabular-nums'>{applyCzechNbsp(service.price)}</span>
          {service.duration ? (
            <span className='text-muted-ink text-sm whitespace-nowrap'>{applyCzechNbsp(service.duration)}</span>
          ) : null}
        </span>

        <p className='text-body max-w-prose text-base leading-relaxed md:col-start-1'>
          {applyCzechNbsp(service.description)}
        </p>
      </button>
    </li>
  )
}

export default function Services() {
  const { setSelectedService } = useBooking()
  const shouldReduceMotion = useReducedMotion()
  const intro = useInView()
  const list = useInView()

  const fadeIn = 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  const hidden = shouldReduceMotion ? '' : 'opacity-0 translate-y-4'

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
    scrollToSection('booking')
  }

  const groups = siteContent.services.groups.map((group, groupIndex, all) => ({
    ...group,
    items: siteContent.services.items.filter((item) => item.category === group.id),
    offset: all
      .slice(0, groupIndex)
      .reduce(
        (sum, previous) => sum + siteContent.services.items.filter((item) => item.category === previous.id).length,
        0,
      ),
  }))

  return (
    <section id='services' className='bg-surface px-5 py-20 md:px-8 md:py-28'>
      <div className={cn(CONTENT_SHELL, 'grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20')}>
        <div ref={intro.ref} className={`${fadeIn} lg:sticky lg:top-28 lg:self-start ${!intro.inView ? hidden : ''}`}>
          <SectionIntro
            id='services-heading'
            align='left'
            title={siteContent.services.heading}
            subtitle={siteContent.services.subtitle}
            description={siteContent.services.intro}
          />
          <p className='border-brand/40 text-muted-ink mt-8 max-w-xs border-l-2 pl-4 text-sm leading-relaxed'>
            {applyCzechNbsp(siteContent.services.selectHint)}
          </p>
        </div>

        <div ref={list.ref} className='flex flex-col gap-12'>
          {groups.map((group) => (
            <div key={group.id}>
              <p
                id={`services-group-${group.id}`}
                className='border-line text-muted-ink mb-2 border-b px-4 pb-3 text-xs font-medium tracking-[0.22em] uppercase md:px-5'
              >
                {applyCzechNbsp(group.title)}
              </p>
              <ul aria-labelledby={`services-group-${group.id}`} className='divide-line/70 divide-y'>
                {group.items.map((service, itemIndex) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    delayMs={shouldReduceMotion ? 0 : Math.min(group.offset + itemIndex + 1, 8) * 70}
                    isVisible={list.inView}
                    fadeIn={fadeIn}
                    hidden={hidden}
                    onClick={() => handleServiceClick(service.name)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
