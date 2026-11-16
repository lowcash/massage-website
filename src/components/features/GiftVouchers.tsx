import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { INVERSE_BUTTON } from '@/src/components/shared/button-styles'

export default function GiftVouchers() {
  const href = `https://wa.me/${siteContent.brand.phoneDigits}?text=${encodeURIComponent(siteContent.vouchers.whatsappMessage)}`

  return (
    <section id='vouchers' className='bg-brand py-[var(--spacing-s6)]'>
      <div className={cn(CONTENT_SHELL, 'grid items-start gap-[var(--spacing-s4)] min-[56rem]:grid-cols-2')}>
        <SectionIntro
          id='vouchers-heading'
          title={siteContent.vouchers.heading}
          subtitle={siteContent.vouchers.subtitle}
          description={siteContent.vouchers.description}
          tone='light'
        />

        <div className='reveal-soft flex flex-col items-start gap-[var(--spacing-s3)]'>
          <ul className='text-on-brand m-0 flex list-none flex-col gap-3 p-0 text-[length:var(--text-fluid-0)]'>
            {siteContent.vouchers.benefits.map((benefit) => (
              <li key={benefit} className='flex items-center gap-3'>
                <span aria-hidden='true' className='bg-on-brand/70 h-1.5 w-1.5 shrink-0 rounded-full' />
                <span className='text-balance'>{applyCzechNbsp(benefit)}</span>
              </li>
            ))}
          </ul>

          <a href={href} target='_blank' rel='noopener noreferrer' className={INVERSE_BUTTON}>
            {applyCzechNbsp(siteContent.vouchers.cta)}
          </a>
        </div>
      </div>
    </section>
  )
}
