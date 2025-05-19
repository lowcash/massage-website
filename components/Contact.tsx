import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Description, H2 } from '@/style/typo'
import { SectionHeaderContainer } from '@/style/common'

import {
  SECTION,
  PHONE,
  EMAIL,
  ADDRESS,
  OPENING_HOURS_SATURDAY,
  OPENING_HOURS_SUNDAY,
  OPENING_HOURS_WORKDAYS,
} from '@/const'

import ContactCTA from '@/components/ContactCTA'

export default function Contact() {
  return (
    <section id={SECTION.CONTACT.id} className='bg-studio-beige px-4 py-24'>
      <div className='container mx-auto'>
        <SectionHeaderContainer>
          <H2>Kde mě najdete?</H2>
          <Description
            dangerouslySetInnerHTML={{ __html: `Ozvěte se mi pro rezervaci nebo s&nbsp;jakýmkoliv dotazem` }}
          />
        </SectionHeaderContainer>

        <div className='mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row'>
          <Card className='rounded-2xl border-0 bg-white p-4 shadow-sm sm:p-6 lg:w-1/2'>
            <CardContent className='space-y-8 p-0'>
              <div>
                <div className='mb-4 flex items-center gap-2'>
                  <MapPin className='text-studio-pink h-6 w-6' />
                  <h3 className='text-studio-pink text-xl font-medium'>Adresa</h3>
                </div>

                <address
                  className='ml-8 text-lg text-gray-700 not-italic'
                  dangerouslySetInnerHTML={{ __html: ADDRESS }}
                />
              </div>

              <Separator className='bg-studio-pink/10' />

              <div>
                <div className='mb-4 flex items-center gap-2'>
                  <svg
                    className='text-studio-gold h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10' />
                    <polyline points='12 6 12 12 16 14' />
                  </svg>
                  <h3 className='text-studio-gold text-xl font-medium'>Otevírací doba</h3>
                </div>

                <ul className='ml-8 space-y-2 text-lg text-gray-700'>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Pondělí - Pátek</span>
                    <span>{OPENING_HOURS_WORKDAYS}</span>
                  </li>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Sobota</span>
                    <span>{OPENING_HOURS_SATURDAY}</span>
                  </li>
                  <li className='flex justify-between'>
                    <span className='font-medium'>Neděle</span>
                    <span>{OPENING_HOURS_SUNDAY}</span>
                  </li>
                </ul>
              </div>

              <Separator className='bg-studio-pink/10' />

              <div className='space-y-4'>
                <div className='mb-4 flex items-center gap-2'>
                  <Phone className='text-studio-pink h-6 w-6' />
                  <h3 className='text-studio-pink text-xl font-medium'>Kontaktní údaje</h3>
                </div>

                <div className='ml-8 flex flex-col space-y-4'>
                  <div className='flex items-center text-lg text-gray-700'>
                    <Phone className='text-studio-gold mr-2 h-5 w-5 flex-shrink-0' />
                    <span className='font-medium'>{PHONE}</span>
                  </div>

                  <div className='flex items-center text-lg text-gray-700'>
                    <Mail className='text-studio-gold mr-2 h-5 w-5 flex-shrink-0' />
                    <span className='font-medium'>{EMAIL}</span>
                  </div>
                </div>
                <div className='mt-2 flex justify-center md:hidden'>
                  <ContactCTA />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='overflow-hidden rounded-2xl border border-gray-100 shadow-md lg:w-1/2'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3885048659795!2d17.12444661318573!3d48.850801601119265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47132e50d40a6673%3A0x15ea7a6c27e74db8!2zTsOhcm9kbsOtIHTFmS4gMzgzLzE1LCA2OTUgMDEgSG9kb27DrW4gMQ!5e0!3m2!1scs!2scz!4v1747158426680!5m2!1scs!2scz'
              width='100%'
              height='100%'
              style={{ border: 0, minHeight: '600px' }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='rounded-2xl shadow-inner'
              title='Mapa s polohou masážního studia'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
