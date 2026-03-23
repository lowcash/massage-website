'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { siteContent } from '@/lib/content'
import PeekCarousel from '@/src/components/shared/PeekCarousel'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import studioImage1 from '@/src/assets/529868a68c329f2cd79b11f95989565412c07b61.png'
import studioImage2 from '@/src/assets/2d115fb3cb1c74e407bde90bbf7d740b4c3604f2.png'
import studioImage3 from '@/src/assets/669702bfa59a3e8017fcb4cb9cbf4fe49cedcddf.png'

const studioImages = [studioImage1, studioImage2, studioImage3]

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id='studio' className='bg-[#f1e3df] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='studio-heading'
            title={siteContent.studio.heading}
            subtitle={siteContent.studio.subtitle}
          />
        </motion.div>

        <motion.div {...getAnimationConfigWithDelay(shouldReduceMotion, 0.1)}>
          <PeekCarousel ariaLabel={siteContent.studio.carouselAriaLabel}>
            {siteContent.studio.images.map((image, index) => (
              <article key={image.id} className='overflow-hidden rounded-xl border border-[#e0c5bf] bg-white shadow-sm'>
                <div className='relative aspect-4/3 w-full'>
                  <Image
                    src={studioImages[index]}
                    alt={image.alt}
                    fill
                    className='object-cover'
                    sizes='(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 84vw'
                  />
                </div>
              </article>
            ))}
          </PeekCarousel>
        </motion.div>
      </div>
    </section>
  )
}
