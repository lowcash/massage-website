import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

import heroImage from '@/src/assets/hero.jpg'
import HeroScrollCue from '@/src/components/features/HeroScrollCue'

const benefits = siteContent.hero.subtitle
  .split('•')
  .map((benefit) => benefit.trim().replace(/\.$/, ''))
  .filter(Boolean)

const [weekdayHours] = siteContent.contact.openingHours
const [experience] = siteContent.about.stats

const facts = [
  `${weekdayHours.day} ${weekdayHours.hours}`,
  `${siteContent.brand.addressLine1}, ${siteContent.footer.cityLabel}`,
  `${experience.value}${experience.suffix} ${experience.label}`,
]

export default function Hero() {
  return (
    <section id='hero' className='relative flex min-h-svh items-center justify-center overflow-hidden'>
      {/* Taller than the section so it can drift down slower than the page without showing an edge. */}
      <div className='hero-parallax absolute inset-x-0 -top-[16vh] bottom-0'>
        <div className='motion-safe:animate-hero-zoom absolute inset-0 scale-[1.06]'>
          <Image src={heroImage} alt={siteContent.hero.imageAlt} fill priority className='object-cover' sizes='100vw' />
        </div>
      </div>

      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(52,32,26,0.16),rgba(30,18,14,0.62))]' />
      <div className='absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[rgba(30,18,14,0.66)] to-transparent' />

      <div className='hero-content-out relative z-20 w-full'>
        <div className='animate-in slide-in-from-bottom-4 relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-24 pb-28 text-center text-white duration-700 md:gap-7 md:pb-44 [@media(max-height:520px)]:pt-28 [@media(max-height:520px)]:pb-20'>
          {/* A soft frosted veil behind the text: the busy photo is blurred and warmed locally, with no visible edge. */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 top-10 bottom-14 -z-10 mx-auto max-w-4xl bg-[radial-gradient(ellipse_closest-side,rgba(62,38,30,0.5),rgba(62,38,30,0.26)_62%,transparent)] [mask-image:radial-gradient(ellipse_closest-side,black_58%,transparent)] backdrop-blur-[10px] [-webkit-mask-image:radial-gradient(ellipse_closest-side,black_58%,transparent)] md:bottom-32'
          />

          <p className='font-dancing text-shadow text-3xl text-white/90 md:text-4xl'>
            {applyCzechNbsp(siteContent.brand.subtitle)}
          </p>

          <h1 className='text-shadow font-display max-w-4xl text-[clamp(2.6rem,13vw,3.4rem)] leading-[1.02] font-medium md:text-8xl [@media(max-height:520px)]:text-5xl'>
            {applyCzechNbsp(siteContent.hero.title)}
          </h1>

          <ul className='flex max-w-3xl flex-wrap justify-center gap-2'>
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className='rounded-full border border-white/30 bg-[rgba(62,38,30,0.42)] px-3 py-1 text-[13px] text-white/95 backdrop-blur-sm md:px-4 md:py-1.5 md:text-base'
              >
                {applyCzechNbsp(benefit)}
              </li>
            ))}
          </ul>

          <div className='mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4'>
            <a
              href='#services'
              className='bg-brand hover:bg-brand-hover rounded-full px-9 py-3.5 text-sm tracking-widest text-white uppercase shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-colors duration-300 ease-out'
            >
              {applyCzechNbsp(siteContent.hero.cta)}
            </a>
            <a
              href='#booking'
              className='rounded-full border border-white/60 px-9 py-3.5 text-sm tracking-widest text-white uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:bg-white/15'
            >
              {applyCzechNbsp(siteContent.hero.secondaryCta)}
            </a>
          </div>
        </div>
      </div>

      <ul className='absolute inset-x-5 bottom-20 z-20 mx-auto hidden w-fit items-center divide-x divide-white/25 rounded-full border border-white/25 bg-[rgba(62,38,30,0.5)] px-2 py-3 text-sm text-white backdrop-blur-md md:flex'>
        {facts.map((fact) => (
          <li key={fact} className='px-6 whitespace-nowrap'>
            {applyCzechNbsp(fact)}
          </li>
        ))}
      </ul>

      <HeroScrollCue href='#services' ariaLabel={siteContent.hero.scrollIndicatorAriaLabel} />
    </section>
  )
}
