'use client'

import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import giftVoucherImage from '@/src/assets/voucher.jpg'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { Reveal } from '@/src/components/shared/Reveal'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function GiftVouchers() {
  const href = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(siteContent.vouchers.whatsappMessage)}`

  return (
    <section id='vouchers' className='bg-surface-alt px-5 py-20 md:px-8 md:py-28'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-14')}>
        <Reveal>
          <SectionIntro
            id='vouchers-heading'
            title={siteContent.vouchers.heading}
            subtitle={siteContent.vouchers.subtitle}
          />
        </Reveal>

        <Reveal
          delayMs={140}
          className='border-line shadow-soft grid gap-0 overflow-hidden rounded-2xl border bg-white md:grid-cols-2'
        >
          <Reveal delayMs={220} className='bg-surface-alt relative min-h-72 p-10'>
            <div aria-hidden='true' className='absolute inset-8 rounded-2xl border border-white/50' />
            <Image
              src={giftVoucherImage}
              alt=''
              fill
              className='object-cover opacity-55'
              sizes='(min-width: 768px) 50vw, 100vw'
            />
          </Reveal>

          <Reveal delayMs={320} className='flex flex-col gap-6 p-8 md:p-10'>
            <p className='text-body text-base leading-relaxed'>{applyCzechNbsp(siteContent.vouchers.description)}</p>

            <ul className='text-body flex flex-col gap-3 text-base'>
              {siteContent.vouchers.benefits.map((benefit) => (
                <li key={benefit} className='flex items-center gap-3'>
                  <span
                    aria-hidden='true'
                    className='bg-brand inline-flex h-5 w-5 items-center justify-center rounded-full text-xs text-white'
                  >
                    ✓
                  </span>
                  <span className='text-balance'>{applyCzechNbsp(benefit)}</span>
                </li>
              ))}
            </ul>

            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-brand hover:bg-brand-hover mt-2 inline-flex w-full justify-center rounded-full px-6 py-3.5 text-xs tracking-[0.16em] text-white uppercase transition-colors duration-300 ease-out'
            >
              {applyCzechNbsp(siteContent.vouchers.cta)}
            </a>
          </Reveal>
        </Reveal>
      </div>
    </section>
  )
}
