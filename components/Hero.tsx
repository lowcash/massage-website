import HeroImageCarousel from '@/components/HeroImageCarousel'
import HeroCTA from '@/components/HeroCTA'

import { SECTION } from '@/const'

import IMAGE1 from '@/app/assets/carousel/1.jpeg'
import IMAGE2 from '@/app/assets/carousel/2.jpeg'
import IMAGE3 from '@/app/assets/carousel/3.jpeg'
import IMAGE4 from '@/app/assets/carousel/4.jpeg'
import IMAGE5 from '@/app/assets/carousel/5.jpeg'
import IMAGE6 from '@/app/assets/carousel/6.jpeg'

export default function Hero() {
  return (
    <section id={SECTION.HERO.id} className='relative h-screen overflow-hidden md:h-screen'>
      <HeroImageCarousel images={[IMAGE1, IMAGE2, IMAGE3, IMAGE4, IMAGE5, IMAGE6]} />

      {/* Content overlay - centered with consistent visibility */}
      <div className='hero-content flex h-full flex-col items-center justify-center px-4'>
        <div className='z-10 max-w-3xl text-center'>
          <h2
            className='font-dancing animate-fade-in mb-6 text-4xl font-bold whitespace-normal text-[rgb(239,219,229)] drop-shadow-sm sm:whitespace-nowrap md:text-5xl lg:text-6xl'
            style={{ textShadow: '0px 2px 8px rgba(0,0,0,0.2)' }}
          >
            Masáže a&nbsp;terapie pro&nbsp;vaše&nbsp;tělo&nbsp;i &nbsp;duši
          </h2>
          <p
            className='animate-slide-up mb-8 font-sans text-lg font-medium text-white/90 md:text-xl'
            style={{ animationDelay: '0.3s', textShadow: '0px 2px 8px rgba(0,0,0,0.2)' }}
          >
            Objevte harmonii a&nbsp;klid prostřednictvím našich profesionálních služeb.
          </p>
          <HeroCTA />
        </div>
      </div>
    </section>
  )
}
