import { Facebook, Instagram } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'

const HEADING_CLASS = 'mb-3 text-[length:var(--text-fluid--1)] tracking-[0.16em] text-on-brand/70 uppercase'
const LINK_CLASS = 'link-wipe'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const contactLabel = siteContent.navigation.items.find((item) => item.id === 'contact')?.label ?? ''
  const brandName = applyCzechNbsp(siteContent.brand.name)
  const socialClass =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-on-brand/40 transition-colors duration-300 ease-out hover:bg-on-brand/12'

  return (
    <footer className='bg-night text-on-brand/85 pt-[var(--spacing-s5)] pb-[var(--spacing-s4)]'>
      <div className={CONTENT_SHELL}>
        <div className='grid gap-[var(--spacing-s4)] md:grid-cols-[1.4fr_1fr_1fr]'>
          <div className='flex flex-col gap-3'>
            <p className='font-display text-on-brand text-[length:var(--text-fluid-2)] leading-tight font-[340] [font-variation-settings:"SOFT"_100,"opsz"_72]'>
              {brandName}
            </p>
            <p>{applyCzechNbsp(siteContent.footer.description)}</p>
            <div className='flex items-center gap-3 pt-1'>
              <a
                href={siteContent.brand.facebook}
                target='_blank'
                rel='noopener noreferrer'
                className={socialClass}
                aria-label={siteContent.footer.facebookAriaLabel}
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href={siteContent.brand.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className={socialClass}
                aria-label={siteContent.footer.instagramAriaLabel}
              >
                <Instagram className='h-5 w-5' />
              </a>
            </div>
          </div>

          <div>
            <p className={HEADING_CLASS}>{contactLabel}</p>
            <address className='leading-[1.7] not-italic'>
              {applyCzechNbsp(siteContent.brand.addressLine1)}
              <br />
              {applyCzechNbsp(siteContent.brand.addressLine2)}
              <br />
              <a href={`tel:+${siteContent.brand.phoneDigits}`} className={LINK_CLASS}>
                {siteContent.brand.phone}
              </a>
              <br />
              <a href={`mailto:${siteContent.brand.email}`} className={LINK_CLASS}>
                {siteContent.brand.email}
              </a>
            </address>
          </div>

          <nav aria-label={siteContent.navigation.footerNavLabel}>
            <p className={HEADING_CLASS}>{siteContent.navigation.footerNavLabel}</p>
            <ul className='m-0 grid list-none gap-1 p-0'>
              {siteContent.navigation.items.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className={cn(LINK_CLASS, 'inline-block py-1')}>
                    {applyCzechNbsp(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className='border-on-brand/20 text-on-brand/70 mt-[var(--spacing-s4)] flex flex-wrap justify-between gap-x-6 gap-y-2 border-t pt-[var(--spacing-s3)] text-[length:var(--text-fluid--1)] leading-relaxed'>
          <p>
            © {currentYear} {brandName}. {siteContent.footer.icoLabel}&nbsp;{siteContent.footer.ico}.{' '}
            <span className='whitespace-nowrap'>{applyCzechNbsp(siteContent.footer.rights)}</span>
          </p>
          <p>{applyCzechNbsp(siteContent.footer.analyticsDisclosure)}</p>
        </div>
      </div>
    </footer>
  )
}
