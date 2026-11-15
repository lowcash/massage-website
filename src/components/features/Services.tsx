import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import ServiceRow from '@/src/components/features/ServiceRow'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function Services() {
  const groups = siteContent.services.groups.map((group) => ({
    ...group,
    items: siteContent.services.items.filter((item) => item.category === group.id),
  }))

  return (
    <section id='services' className='bg-band py-[var(--spacing-s6)]'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s5)]')}>
        <SectionIntro
          id='services-heading'
          title={siteContent.services.heading}
          subtitle={siteContent.services.subtitle}
          description={siteContent.services.intro}
        />

        <div className='grid gap-[var(--spacing-s5)] min-[62rem]:grid-cols-3 min-[62rem]:gap-[var(--spacing-s4)]'>
          {groups.map((group, index) => (
            <div key={group.id} className='reveal-soft grid content-start gap-[var(--spacing-s1)]'>
              <p
                id={`services-group-${group.id}`}
                data-no={String(index + 1).padStart(2, '0')}
                className='font-display text-ink before:text-brand/80 border-line flex items-baseline gap-3.5 border-b pb-3 text-[length:var(--text-fluid-1)] leading-tight font-[340] [font-variation-settings:"SOFT"_60,"opsz"_96] before:font-sans before:text-[length:var(--text-fluid--1)] before:tracking-[0.14em] before:content-[attr(data-no)]'
              >
                {applyCzechNbsp(group.title)}
              </p>
              <ul aria-labelledby={`services-group-${group.id}`} className='m-0 grid list-none gap-0 p-0'>
                {group.items.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className='text-muted-ink -mt-[var(--spacing-s3)] flex items-center gap-2.5 text-[length:var(--text-fluid--1)]'>
          <span aria-hidden='true'>↳</span>
          {applyCzechNbsp(siteContent.services.selectHint)}
        </p>
      </div>
    </section>
  )
}
