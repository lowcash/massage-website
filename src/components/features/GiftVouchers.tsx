'use client'

import Image from 'next/image'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

import giftVoucherImage from '@/src/assets/voucher.jpg'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

export default function GiftVouchers() {
  const href = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(siteContent.vouchers.whatsappMessage)}`
  const shouldReduceMotion = useReducedMotion()
  const intro = useInView()
  const card = useInView()

  const fadeIn = 'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  const hidden = shouldReduceMotion ? '' : 'opacity-0 translate-y-4'

  return (
    <section id='vouchers' className='bg-[#ecd8d3] px-5 py-20 md:px-8 md:py-28'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <div ref={intro.ref} className={`${fadeIn} ${!intro.inView ? hidden : ''}`}>
          <SectionIntro
            id='vouchers-heading'
            title={siteContent.vouchers.heading}
            subtitle={siteContent.vouchers.subtitle}
          />
        </div>

        <div
          ref={card.ref}
          className={`grid gap-0 overflow-hidden rounded-2xl border border-[#e1c1ba] bg-white shadow-[0_14px_40px_rgba(91,58,50,0.08)] transition-[opacity,transform,box-shadow] duration-500 ease-out md:grid-cols-2 ${!card.inView ? hidden : ''}`}
          style={{ transitionDelay: card.inView ? '140ms' : '0ms' }}
        >
          <div
            className={`${fadeIn} relative min-h-72 bg-[#f1ddd7] p-10 ${!card.inView ? hidden : ''}`}
            style={{ transitionDelay: card.inView ? '220ms' : '0ms' }}
          >
            <div className='absolute inset-8 rounded-xl border border-white/50' />
            <Image
              src={giftVoucherImage}
              alt={siteContent.vouchers.imageAlt}
              fill
              className='object-cover opacity-55'
              sizes='(min-width: 768px) 50vw, 100vw'
            />
          </div>

          <div
            className={`flex flex-col gap-6 p-8 ${fadeIn} md:p-10 ${!card.inView ? hidden : ''}`}
            style={{ transitionDelay: card.inView ? '320ms' : '0ms' }}
          >
            <h3 className='text-4xl leading-tight text-[#2f2523]' style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {applyCzechNbsp(siteContent.vouchers.title)}
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
              {applyCzechNbsp(siteContent.vouchers.cta)}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
