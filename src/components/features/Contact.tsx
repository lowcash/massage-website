import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function Contact() {
  const cardClassName = 'rounded-2xl border border-[#e3ccc7] bg-white p-5 text-[15px] leading-relaxed text-[#5c4b47]'
  const linkCardClassName = `${cardClassName} cursor-pointer transition-colors duration-300 ease-out hover:border-[#d8b6af] hover:bg-[#fff8f6]`

  return (
    <section id='contact' className='bg-[#ecd8d3] px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <SectionIntro
          id='contact-heading'
          title={siteContent.contact.heading}
          subtitle={siteContent.contact.subtitle}
        />

        <div className='grid gap-7 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <a href={`tel:+${siteContent.brand.phoneDigits}`} className={linkCardClassName}>
              <div className='mb-3 flex items-center gap-2 text-[#ca6f61]'>
                <Phone className='h-4 w-4' />
                <p className='text-xs tracking-[0.14em] uppercase'>{siteContent.contact.cards.phoneLabel}</p>
              </div>
              <p className='text-[#463633]'>{siteContent.brand.phone}</p>
            </a>

            <a href={`mailto:${siteContent.brand.email}`} className={linkCardClassName}>
              <div className='mb-3 flex items-center gap-2 text-[#ca6f61]'>
                <Mail className='h-4 w-4' />
                <p className='text-xs tracking-[0.14em] uppercase'>{siteContent.contact.cards.emailLabel}</p>
              </div>
              <p className='break-all text-[#463633]'>{siteContent.brand.email}</p>
            </a>

            <a
              href={siteContent.brand.mapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className={linkCardClassName}
            >
              <div className='mb-3 flex items-center gap-2 text-[#ca6f61]'>
                <MapPin className='h-4 w-4' />
                <p className='text-xs tracking-[0.14em] uppercase'>{siteContent.contact.cards.addressLabel}</p>
              </div>
              <p>{applyCzechNbsp(siteContent.brand.addressLine1)}</p>
              <p>{applyCzechNbsp(siteContent.brand.addressLine2)}</p>
            </a>

            <div className={cardClassName}>
              <div className='mb-3 flex items-center gap-2 text-[#ca6f61]'>
                <Clock className='h-4 w-4' />
                <p className='text-xs tracking-[0.14em] uppercase'>{siteContent.contact.cards.openingHoursLabel}</p>
              </div>

              <div className='flex flex-col gap-1.5'>
                {siteContent.contact.openingHours.map((item) => (
                  <p key={item.day} className='flex items-center justify-between'>
                    <span>{item.day}</span>
                    <span className='text-[#463633]'>{item.hours}</span>
                  </p>
                ))}
              </div>

              <p className='mt-3 text-sm text-[#796661]'>{applyCzechNbsp(siteContent.contact.cards.flexibilityNote)}</p>
            </div>
          </div>

          <div>
            <div className='h-full min-h-[420px] overflow-hidden rounded-2xl border border-[#e3ccc7] bg-white'>
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
