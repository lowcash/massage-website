'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'
import CountUpValue from '@/src/components/shared/CountUpValue'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import profileImage from '@/src/assets/profile.jpg'

export default function About() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id='about' className='bg-[#f6edeb] px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='about-heading'
            title={siteContent.about.heading}
            subtitle={siteContent.about.subtitle}
          />
        </motion.div>

        <div className='grid items-start gap-7 rounded-2xl border border-[#e6d1cb] bg-white p-6 shadow-[0_20px_45px_rgba(90,60,53,0.1)] md:p-10 lg:grid-cols-2 lg:items-stretch'>
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.2)}
            className='order-2 flex h-full flex-col gap-7 md:order-2'
          >
            <div className='flex flex-col gap-1'>
              <h3 className='text-[2rem] text-[#2f2523]' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {siteContent.brand.therapistName}
              </h3>
              <p className='text-[15px] tracking-[0.12em] text-[#a46f67] uppercase'>
                {applyCzechNbsp(siteContent.about.role)}
              </p>
            </div>

            <div className='flex flex-col gap-4 text-[15px] leading-relaxed text-[#5d4c48]'>
              {siteContent.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{applyCzechNbsp(paragraph)}</p>
              ))}
            </div>

            <div className='grid grid-cols-3 gap-2 border-t border-[#ecd8d3] pt-5 sm:gap-4'>
              {siteContent.about.stats.map((stat) => (
                <div key={stat.id} className='flex flex-col items-center text-center'>
                  <p className='font-dancing text-4xl text-[#ca6f61] sm:text-5xl'>
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
                  <span>{applyCzechNbsp(credential)}</span>
                </div>
              ))}

              <p className='pt-1 text-sm leading-relaxed text-[#8a706a] italic'>
                {applyCzechNbsp(siteContent.about.closingLine)}
              </p>
            </div>
          </motion.div>

          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.3)}
            className='order-1 md:order-1 md:mx-auto md:w-full md:max-w-2xl lg:h-full lg:max-w-none'
          >
            <div className='overflow-hidden rounded-2xl bg-[#efe6e3] lg:h-full lg:max-h-none'>
              <Image
                src={profileImage}
                alt={siteContent.brand.therapistName}
                className='h-auto w-full object-cover object-top lg:h-full lg:max-h-none'
                priority={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}