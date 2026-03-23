'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { siteContent } from '@/lib/content'
import CountUpValue from '@/src/components/shared/CountUpValue'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import profileImage from '@/src/assets/56d78eee09ad0ac51d12b673a62b4fb6b3748b3e.png'

export default function About() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id='about' className='bg-[#f6edeb] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='about-heading'
            title={siteContent.about.heading}
            subtitle={siteContent.about.subtitle}
          />
        </motion.div>

        <div className='grid items-start gap-7 rounded-2xl border border-[#e6d1cb] bg-white p-6 shadow-[0_20px_45px_rgba(90,60,53,0.1)] md:p-10 lg:grid-cols-[1.15fr_0.85fr]'>
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.2)}
            className='order-2 flex flex-col gap-7 lg:order-1'
          >
            <div className='flex flex-col gap-1'>
              <h3 className='text-[2rem] text-[#2f2523]' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {siteContent.brand.therapistName}
              </h3>
              <p className='text-[15px] tracking-[0.12em] text-[#a46f67] uppercase'>
                {siteContent.about.role}
              </p>
            </div>

            <div className='flex flex-col gap-4 text-[15px] leading-relaxed text-[#5d4c48]'>
              {siteContent.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className='grid grid-cols-3 gap-4 border-t border-[#ecd8d3] pt-5'>
              {siteContent.about.stats.map((stat) => (
                <div key={stat.id} className='flex flex-col items-center text-center'>
                  <p className='font-dancing text-5xl text-[#ca6f61]'>
                    <CountUpValue value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className='text-xs leading-relaxed text-[#74625d] uppercase'>{stat.label}</p>
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-3 border-t border-[#ecd8d3] pt-5'>
              {siteContent.about.credentials.map((credential) => (
                <div key={credential} className='flex items-start gap-3 text-[15px] leading-relaxed text-[#5d4c48]'>
                  <span className='mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ca6f61]' />
                  <span>{credential}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.3)}
            className='order-1 self-start lg:order-2'
          >
            <div className='overflow-hidden rounded-2xl bg-[#efe6e3]'>
              <Image
                src={profileImage}
                alt={siteContent.brand.therapistName}
                className='h-auto w-full object-cover object-top'
                priority={false}
              />

              <div className='bg-[#f3e5e1] px-5 py-4 text-sm tracking-[0.12em] text-[#7a625d] uppercase'>
                {siteContent.brand.therapistName}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}