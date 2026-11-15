import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { findNextFreeSlot } from '@/lib/next-free-slot'
import { applyCzechNbsp, cn } from '@/lib/utils'

import heroImage from '@/src/assets/hero.webp'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import SectionAnchor from '@/src/components/shared/SectionAnchor'
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/src/components/shared/button-styles'

const [weekdayHours] = siteContent.contact.openingHours
const [experience] = siteContent.about.stats

const ACCENT_WORD = 'uleví'
const [titleBefore, titleAfter] = siteContent.hero.title.includes(ACCENT_WORD)
  ? siteContent.hero.title.split(ACCENT_WORD)
  : [siteContent.hero.title, '']

interface HeroProps {
  /** Same slot payload the booking calendar receives; drives the "nearest free slot" badge. */
  calendarData?: unknown
}

export default function Hero({ calendarData }: HeroProps) {
  const nextSlot = findNextFreeSlot(calendarData, siteContent.calendar.dayNames)

  return (
    <section
      id='hero'
      className='pt-[calc(var(--navigation-offset)+var(--spacing-s4))] pb-[var(--spacing-s5)]'
      aria-labelledby='hero-heading'
    >
      <div
        className={cn(
          CONTENT_SHELL,
          'grid items-center gap-[var(--spacing-s4)] min-[56rem]:grid-cols-[1.15fr_0.85fr] min-[56rem]:gap-[var(--spacing-s5)]',
        )}
      >
        <div>
          <p className='text-muted-ink text-[length:var(--text-fluid--1)] tracking-[0.16em] uppercase'>
            {applyCzechNbsp(siteContent.brand.subtitle)}
          </p>

          {/* LCP-adjacent text: no animation, no transform. */}
          <h1
            id='hero-heading'
            className='mt-[var(--spacing-s2)] mb-[var(--spacing-s3)] text-[length:var(--text-fluid-hero)] leading-[1.05] font-[300] tracking-[-0.018em] [font-variation-settings:"SOFT"_100,"opsz"_144]'
          >
            {applyCzechNbsp(titleBefore)}
            {titleAfter ? (
              <em className='text-brand mr-[0.12em] font-[inherit] italic [font-variation-settings:"SOFT"_100,"opsz"_144]'>
                {ACCENT_WORD}
              </em>
            ) : null}
            {titleAfter ? applyCzechNbsp(titleAfter) : null}
          </h1>

          <p className='text-body mb-[var(--spacing-s4)] max-w-[34ch] text-[length:var(--text-fluid-1)] leading-[1.5]'>
            {applyCzechNbsp(siteContent.hero.lead)}
          </p>

          <div className='flex flex-wrap gap-3'>
            <SectionAnchor sectionId='services' className={PRIMARY_BUTTON}>
              {applyCzechNbsp(siteContent.hero.cta)}
            </SectionAnchor>
            <SectionAnchor sectionId='booking' className={SECONDARY_BUTTON}>
              {applyCzechNbsp(siteContent.hero.secondaryCta)}
            </SectionAnchor>
          </div>

          {nextSlot ? (
            <p className='text-body mt-[var(--spacing-s3)] flex items-center gap-3 text-[length:var(--text-fluid--1)]'>
              <span aria-hidden='true' className='bg-sage h-2 w-2 shrink-0 rounded-full' />
              <span>
                Nejbližší volný termín:{' '}
                <b className='text-ink font-medium'>
                  {applyCzechNbsp(`${nextSlot.day} ${nextSlot.date} v ${nextSlot.time}`)}
                </b>
              </span>
            </p>
          ) : null}

          <ul className='border-line text-muted-ink mt-[var(--spacing-s4)] flex list-none flex-wrap gap-x-6 gap-y-2 border-t p-0 pt-[var(--spacing-s3)] text-[length:var(--text-fluid--1)]'>
            <li>
              <b className='text-ink font-medium'>{applyCzechNbsp(weekdayHours.day)}</b>{' '}
              {applyCzechNbsp(weekdayHours.hours)}
            </li>
            <li>{applyCzechNbsp(`${siteContent.brand.addressLine1}, ${siteContent.footer.cityLabel}`)}</li>
            <li>
              <b className='text-ink font-medium'>
                {experience.value}
                {experience.suffix}
              </b>{' '}
              {applyCzechNbsp(experience.label)}
            </li>
          </ul>
        </div>

        <figure className='relative order-first m-0 w-full justify-self-center max-[55.99rem]:max-w-[34rem] min-[56rem]:order-none min-[56rem]:justify-self-end'>
          <div className='bg-surface-alt relative aspect-5/4 overflow-hidden rounded-(--radius-lg) min-[56rem]:aspect-4/5'>
            {/* LCP element: priority, intrinsic size, no animation or transform. */}
            <Image
              src={heroImage}
              alt={siteContent.hero.imageAlt}
              fill
              priority
              fetchPriority='high'
              quality={80}
              placeholder='blur'
              className='photo-soft object-cover object-[74%_48%]'
              sizes='(min-width: 56rem) 30rem, (min-width: 34rem) 34rem, 100vw'
            />
            <div aria-hidden='true' className='bg-surface/12 absolute inset-0' />
          </div>
        </figure>
      </div>
    </section>
  )
}
