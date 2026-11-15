import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function GiftVouchers() {
  const href = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(siteContent.vouchers.whatsappMessage)}`

  return (
    <section id='vouchers' className='py-[var(--spacing-s5)]'>
      <div className={cn(CONTENT_SHELL, 'grid items-start gap-[var(--spacing-s4)] min-[56rem]:grid-cols-2')}>
        <SectionIntro
          id='vouchers-heading'
          title={siteContent.vouchers.heading}
          subtitle={siteContent.vouchers.subtitle}
          description={siteContent.vouchers.description}
        />

        <div className='reveal-soft flex flex-col items-start gap-[var(--spacing-s3)]'>
          <ul className='text-body m-0 flex list-none flex-col gap-3 p-0 text-[length:var(--text-fluid-0)]'>
            {siteContent.vouchers.benefits.map((benefit) => (
              <li key={benefit} className='flex items-center gap-3'>
                <span
                  aria-hidden='true'
                  className='bg-brand text-on-brand inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs'
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
            className='btn-lift text-ink hover:bg-surface-alt inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[color-mix(in_oklab,var(--color-ink)_28%,transparent)] px-7 py-3 text-[0.8125rem] leading-none font-semibold tracking-[0.14em] uppercase transition-[background-color,border-color] duration-260 ease-(--ease-soft) hover:border-transparent'
          >
            {applyCzechNbsp(siteContent.vouchers.cta)}
            <span aria-hidden='true'>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
