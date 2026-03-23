'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'
import {
  getAnimationConfig,
  getAnimationConfigWithDelay,
  useReducedMotion,
} from '@/src/hooks/useReducedMotion'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import giftVoucherImage from '@/src/assets/poukazy.jpg'

export default function GiftVouchers() {
  const shouldReduceMotion = useReducedMotion()

  const href = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(siteContent.vouchers.whatsappMessage)}`

  return (
    <section id='vouchers' className='bg-[#ecd8d3] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <motion.div {...getAnimationConfig(shouldReduceMotion)}>
          <SectionIntro
            id='vouchers-heading'
            title={siteContent.vouchers.heading}
            subtitle={siteContent.vouchers.subtitle}
          />
        </motion.div>

        <div className='grid gap-0 overflow-hidden rounded-2xl border border-[#e1c1ba] bg-white shadow-[0_14px_40px_rgba(91,58,50,0.08)] md:grid-cols-2'>
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.05)}
            className='relative min-h-72 bg-linear-to-br from-[#e4b5ac] to-[#c97b6f] p-10'
          >
            <div className='absolute inset-8 rounded-xl border border-white/35' />
            <Image
              src={giftVoucherImage}
              alt={siteContent.vouchers.imageAlt}
              fill
              className='object-cover opacity-30 mix-blend-overlay'
              sizes='(min-width: 768px) 50vw, 100vw'
            />
          </motion.div>

          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.15)}
            className='flex flex-col gap-6 p-8 md:p-10'
          >
            <h3 className='text-4xl leading-tight text-[#2f2523]' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {siteContent.vouchers.title}
            </h3>

            <p className='text-[15px] leading-relaxed text-[#5d4c48]'>
              {applyCzechNbsp(siteContent.vouchers.description)}
            </p>

            <ul className='flex flex-col gap-3 text-[15px] text-[#5d4c48]'>
              {siteContent.vouchers.benefits.map((benefit) => (
                <li key={benefit} className='flex items-center gap-3'>
                  <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ca6f61] text-xs text-white'>
                    ✓
                  </span>
                  <span>{applyCzechNbsp(benefit)}</span>
                </li>
              ))}
            </ul>

            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-2 inline-flex w-full justify-center rounded-md bg-[#ca6f61] px-6 py-3 text-xs tracking-[0.16em] text-white uppercase transition hover:bg-[#b45c4f]'
            >
              {siteContent.vouchers.cta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
