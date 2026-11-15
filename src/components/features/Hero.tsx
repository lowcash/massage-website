import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { findNextFreeSlot } from '@/lib/next-free-slot'
import { applyCzechNbsp, cn } from '@/lib/utils'

import heroImage from '@/src/assets/hero.webp'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import SectionAnchor from '@/src/components/shared/SectionAnchor'

const benefits = siteContent.hero.subtitle
  .split('•')
  .map((benefit) => benefit.trim().replace(/\.$/, ''))
  .filter(Boolean)

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
          <p className='font-dancing text-brand mb-1 block text-[clamp(1.6rem,1.3rem+1.2vw,2.2rem)] leading-tight'>
            {applyCzechNbsp(siteContent.brand.subtitle)}
          </p>

          {/* LCP-adjacent text: no animation, no transform. */}
          <h1
            id='hero-heading'
            className='mt-[var(--spacing-s2)] mb-[var(--spacing-s3)] text-[length:var(--text-fluid-hero)] leading-[1.02] font-[380] tracking-[-0.022em] [font-variation-settings:"SOFT"_80,"opsz"_144]'
          >
            {applyCzechNbsp(titleBefore)}
            {titleAfter ? (
              <em className='text-brand mr-[0.12em] font-[inherit] italic [font-variation-settings:"SOFT"_100,"opsz"_144]'>
                {ACCENT_WORD}
              </em>
            ) : null}
            {titleAfter ? applyCzechNbsp(titleAfter) : null}
          </h1>

          <ul
            aria-label={siteContent.hero.subtitle}
            className='mb-[var(--spacing-s4)] flex list-none flex-wrap gap-2 p-0'
          >
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className='bg-surface-alt text-ink rounded-full px-4 py-1.5 text-[length:var(--text-fluid--1)] font-medium'
              >
                {applyCzechNbsp(benefit)}
              </li>
            ))}
          </ul>

          <div className='flex flex-wrap gap-3'>
            <SectionAnchor
              sectionId='services'
              className='btn-lift bg-brand text-on-brand hover:bg-brand-hover inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.8125rem] leading-none font-semibold tracking-[0.14em] uppercase shadow-[0_10px_24px_-8px_rgb(120_50_36/0.45)] transition-[background-color,box-shadow,transform] duration-260 ease-(--ease-soft) hover:-translate-y-px hover:shadow-[0_14px_28px_-8px_rgb(120_50_36/0.5)] active:scale-[0.98]'
            >
              {applyCzechNbsp(siteContent.hero.cta)}
              <span aria-hidden='true'>→</span>
            </SectionAnchor>
            <SectionAnchor
              sectionId='booking'
              className='btn-lift text-ink hover:bg-surface-alt inline-flex min-h-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-ink)_28%,transparent)] px-7 py-3 text-[0.8125rem] leading-none font-semibold tracking-[0.14em] uppercase transition-[background-color,border-color] duration-260 ease-(--ease-soft) hover:border-transparent'
            >
              {applyCzechNbsp(siteContent.hero.secondaryCta)}
            </SectionAnchor>
          </div>

          <ul className='border-line text-muted-ink mt-[var(--spacing-s4)] flex list-none flex-wrap gap-x-6 gap-y-2 border-t p-0 pt-[var(--spacing-s3)] text-[length:var(--text-fluid--1)]'>
            <li>
              <b className='text-ink font-semibold'>{applyCzechNbsp(weekdayHours.day)}</b>{' '}
              {applyCzechNbsp(weekdayHours.hours)}
            </li>
            <li>{applyCzechNbsp(`${siteContent.brand.addressLine1}, ${siteContent.footer.cityLabel}`)}</li>
            <li>
              <b className='text-ink font-semibold'>
                {experience.value}
                {experience.suffix}
              </b>{' '}
              {applyCzechNbsp(experience.label)}
            </li>
          </ul>
        </div>

        <figure className='relative order-first m-0 w-full justify-self-center max-[55.99rem]:max-w-[34rem] min-[56rem]:order-none min-[56rem]:justify-self-end'>
          <div className='bg-surface-alt shadow-lift relative aspect-5/4 overflow-hidden rounded-(--radius-organic) min-[56rem]:aspect-4/5'>
            {/* LCP element: priority, intrinsic size, no animation or transform. */}
            <Image
              src={heroImage}
              alt={siteContent.hero.imageAlt}
              fill
              priority
              fetchPriority='high'
              quality={80}
              placeholder='blur'
              className='object-cover object-[74%_48%] [filter:saturate(1.06)_contrast(1.05)_brightness(1.02)]'
              sizes='(min-width: 56rem) 30rem, (min-width: 34rem) 34rem, 100vw'
            />
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,transparent_55%,rgb(158_79_60/0.12))]'
            />
          </div>

          {nextSlot ? (
            <p className='bg-paper text-ink shadow-lift absolute bottom-6 left-2 m-0 flex items-center gap-3 rounded-(--radius-md) px-4 py-3 text-[length:var(--text-fluid--1)] leading-snug min-[56rem]:-left-8'>
              <span
                aria-hidden='true'
                className='bg-sage h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-sage)_22%,transparent)]'
              />
              <span>
                <b className='font-semibold'>Nejbližší volný termín</b>
                <br />
                {applyCzechNbsp(`${nextSlot.day} ${nextSlot.date} v ${nextSlot.time}`)}
              </span>
            </p>
          ) : null}
        </figure>
      </div>
    </section>
  )
}
