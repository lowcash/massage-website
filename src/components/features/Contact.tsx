import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, cn } from '@/lib/utils'

import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function Contact() {
  const cardClassName = 'rounded-2xl border border-line bg-white p-5 text-base leading-relaxed text-body'
  const linkCardClassName = `${cardClassName} cursor-pointer transition-colors duration-300 ease-out hover:border-line hover:bg-paper`

  return (
    <section id='contact' className='bg-surface-alt px-5 py-16 md:px-8 md:py-24'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-14')}>
        <SectionIntro
          id='contact-heading'
          title={siteContent.contact.heading}
          subtitle={siteContent.contact.subtitle}
        />

        <div className='grid gap-7 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <a href={`tel:+${siteContent.brand.phoneDigits}`} className={linkCardClassName}>
              <div className='text-brand mb-3 flex items-center gap-2'>
                <Phone className='h-4 w-4' />
                <p className='text-brand-hover text-xs tracking-[0.14em] uppercase'>
                  {siteContent.contact.cards.phoneLabel}
                </p>
              </div>
              <p className='text-body'>{siteContent.brand.phone}</p>
            </a>

            <a href={`mailto:${siteContent.brand.email}`} className={linkCardClassName}>
              <div className='text-brand mb-3 flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <p className='text-brand-hover text-xs tracking-[0.14em] uppercase'>
                  {siteContent.contact.cards.emailLabel}
                </p>
              </div>
              <p className='text-body break-all'>{siteContent.brand.email}</p>
            </a>

            <a
              href={siteContent.brand.mapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className={linkCardClassName}
            >
              <div className='text-brand mb-3 flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                <p className='text-brand-hover text-xs tracking-[0.14em] uppercase'>
                  {siteContent.contact.cards.addressLabel}
                </p>
              </div>
              <p>{applyCzechNbsp(siteContent.brand.addressLine1)}</p>
              <p>{applyCzechNbsp(siteContent.brand.addressLine2)}</p>
            </a>

            <div className={cardClassName}>
              <div className='text-brand mb-3 flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                <p className='text-brand-hover text-xs tracking-[0.14em] uppercase'>
                  {siteContent.contact.cards.openingHoursLabel}
                </p>
              </div>

              <div className='flex flex-col gap-1.5'>
                {siteContent.contact.openingHours.map((item) => (
                  <p key={item.day} className='flex items-center justify-between'>
                    <span>{item.day}</span>
                    <span className='text-body'>{item.hours}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className='border-line h-full min-h-[420px] overflow-hidden rounded-2xl border bg-white'>
              <iframe
                src={siteContent.brand.mapsEmbed}
                width='100%'
                height='100%'
                className='h-full min-h-[420px] w-full'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title={siteContent.contact.mapTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
