import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

import heroImage from '@/src/assets/hero.jpg'
import HeroScrollCue from '@/src/components/features/HeroScrollCue'

export default function Hero() {
  return (
    <section id='hero' className='relative flex min-h-svh items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 scale-[1.06]'>
        <Image src={heroImage} alt={siteContent.hero.imageAlt} fill priority className='object-cover' sizes='100vw' />
      </div>

      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(41,30,26,0.18),rgba(24,15,12,0.64))]' />

      <div className='animate-in fade-in slide-in-from-bottom-4 relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-16 pb-16 text-center text-white duration-700 md:gap-8'>
        <div className='pointer-events-none absolute inset-x-5 top-1/2 -z-10 h-[62%] -translate-y-1/2 rounded-4xl bg-black/24 blur-2xl md:inset-x-12 md:h-[58%] md:bg-black/20' />

        <p className='text-sm tracking-[0.24em] text-white/85 uppercase'>
          {applyCzechNbsp(siteContent.brand.subtitle)}
        </p>

        <h1
          className='text-shadow max-w-4xl text-5xl leading-[1.1] md:text-7xl'
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {applyCzechNbsp(siteContent.hero.title)}
        </h1>

        <p className='text-shadow max-w-2xl text-[15px] leading-relaxed text-white/90 md:text-xl'>
          {applyCzechNbsp(siteContent.hero.subtitle)}
        </p>

        <a
          href='#services'
          className='rounded-md bg-[#ca6f61] px-8 py-3 text-sm tracking-widest text-white uppercase transition-colors duration-300 ease-out hover:bg-[#b55d50]'
        >
          {applyCzechNbsp(siteContent.hero.cta)}
        </a>
      </div>

      <HeroScrollCue href='#services' ariaLabel={siteContent.hero.scrollIndicatorAriaLabel} />
    </section>
  )
}
