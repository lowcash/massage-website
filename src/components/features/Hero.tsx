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
    <section id='hero' className='relative flex min-h-svh items-center overflow-hidden'>
      {/* Taller than the section so it can drift down slower than the page without showing an edge. */}
      <div className='hero-parallax absolute inset-x-0 -top-[16svh] bottom-0'>
        <div className='motion-safe:animate-hero-zoom absolute inset-0 scale-[1.06]'>
          <Image
            src={heroImage}
            alt={siteContent.hero.imageAlt}
            fill
            priority
            placeholder='blur'
            className='object-cover object-[62%_42%] brightness-[0.88] contrast-[0.96] saturate-[0.9] md:object-[68%_40%]'
            sizes='100vw'
          />
        </div>
      </div>

      {/* Left-weighted wash: keeps the photo alive on the right, darkens the reading zone. */}
      <div className='absolute inset-0 bg-[linear-gradient(105deg,rgba(28,16,12,0.78)_0%,rgba(28,16,12,0.58)_38%,rgba(28,16,12,0.28)_68%,rgba(28,16,12,0.18)_100%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_28%_48%,rgba(22,12,10,0.42),transparent_70%)]' />
      <div className='absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-[rgba(22,12,10,0.72)] via-[rgba(22,12,10,0.28)] to-transparent' />

      <div className='hero-content-out relative z-20 w-full'>
        <div className='animate-in slide-in-from-bottom-4 relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-6 pt-28 pb-32 text-center text-white duration-700 md:items-start md:gap-6 md:px-10 md:pt-32 md:pb-40 md:text-left lg:px-14 [@media(max-height:520px)]:pt-28 [@media(max-height:520px)]:pb-20'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-4 top-16 bottom-20 -z-10 mx-auto max-w-3xl bg-[radial-gradient(ellipse_closest-side,rgba(22,12,10,0.55),rgba(22,12,10,0.22)_58%,transparent)] [mask-image:radial-gradient(ellipse_closest-side,black_52%,transparent)] backdrop-blur-[14px] [-webkit-mask-image:radial-gradient(ellipse_closest-side,black_52%,transparent)] md:inset-x-0 md:bottom-28 md:mx-0 md:max-w-xl md:bg-[radial-gradient(ellipse_closest-side,rgba(22,12,10,0.5),rgba(22,12,10,0.18)_60%,transparent)] md:[mask-image:radial-gradient(ellipse_at_left,black_48%,transparent_78%)] md:[-webkit-mask-image:radial-gradient(ellipse_at_left,black_48%,transparent_78%)]'
          />

          <p className='font-dancing text-shadow-hero text-3xl text-white/92 md:text-4xl'>
            {applyCzechNbsp(siteContent.brand.subtitle)}
          </p>

          <div className='flex max-w-xl flex-col gap-4 md:max-w-2xl md:gap-5'>
            <h1 className='text-shadow-hero font-display text-[clamp(2.55rem,12vw,3.35rem)] leading-[1.04] font-medium md:text-7xl lg:text-8xl [@media(max-height:520px)]:text-5xl'>
              {applyCzechNbsp(siteContent.hero.title)}
            </h1>

            <div className='flex flex-col items-center gap-3 md:items-start'>
              <span aria-hidden='true' className='h-px w-12 bg-white/40' />
              <p className='text-shadow-hero font-display flex max-w-[17rem] flex-col gap-1.5 text-center text-[1.15rem] leading-snug text-white/86 italic md:max-w-md md:gap-2 md:text-left md:text-[1.35rem]'>
                {benefits.map((benefit) => (
                  <span key={benefit}>{applyCzechNbsp(benefit)}</span>
                ))}
              </p>
            </div>
          </div>

          <div className='flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center md:justify-start md:gap-4'>
            <a
              href='#services'
              className='bg-brand hover:bg-brand-hover rounded-full px-9 py-3.5 text-center text-sm tracking-widest text-white uppercase shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-300 ease-out'
            >
              {applyCzechNbsp(siteContent.hero.cta)}
            </a>
            <a
              href='#booking'
              className='rounded-full border border-white/55 bg-white/8 px-9 py-3.5 text-center text-sm tracking-widest text-white uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:bg-white/16'
            >
              {applyCzechNbsp(siteContent.hero.secondaryCta)}
            </a>
          </div>

          <ul className='mt-3 hidden divide-x divide-white/25 text-sm text-white/80 md:flex'>
            {facts.map((fact) => (
              <li key={fact} className='px-4 whitespace-nowrap first:pl-0 last:pr-0'>
                {applyCzechNbsp(fact)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroScrollCue href='#services' ariaLabel={siteContent.hero.scrollIndicatorAriaLabel} />
    </section>
  )
}
