'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, QrCode, ArrowRight } from 'lucide-react'

import {
  SECTION,
  PHONE,
  EMAIL,
  ADDRESS,
  OPENING_HOURS_SATURDAY,
  OPENING_HOURS_SUNDAY,
  OPENING_HOURS_WORKDAYS,
} from '@/const'

export default function Contact() {
  return (
    <section id={SECTION.CONTACT.id} className='bg-studio-beige px-4 py-24'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='section-title text-4xl md:text-5xl'>Kontakt</h2>
          <p className='mx-auto mt-4 max-w-3xl font-sans text-lg text-gray-600'>
            Ozvěte se mi pro rezervaci nebo s jakýmkoliv dotazem
          </p>
        </div>

        <div className='mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row'>
          <Card className='rounded-2xl border-0 bg-white p-6 shadow-sm lg:w-1/2'>
            <CardContent className='space-y-8 p-0'>
              <div>
                <div className='mb-4 flex items-center gap-2'>
                  <MapPin className='text-studio-pink h-6 w-6' />
                  <h3 className='text-studio-pink text-xl font-medium'>Kde nás najdete</h3>
                </div>

                <address
                  className='ml-8 text-lg text-gray-700 not-italic'
                  dangerouslySetInnerHTML={{ __html: ADDRESS }}
                />

                {/* <div className='mt-4 flex justify-center'>
                  <Button
                    variant='outline'
                    className='text-studio-pink border-studio-pink transition-all hover:bg-pink-50'
                    onClick={() =>
                      window.open('https://maps.google.com/?q=Masážní+studio+Klidný+dotek+Květinová+25+Praha', '_blank')
                    }
                  >
                    Zobrazit trasu <ArrowRight className='ml-1' />
                  </Button>
                </div> */}
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

                  {/* <div className='mt-2 flex justify-center'>
                    <Button
                      className='bg-studio-pink hover:bg-studio-pink/90 rounded-full px-8 py-3 text-lg text-white shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg'
                      onClick={() => (window.location.href = 'tel:+420123456789')}
                    >
                      <Phone className='mr-2 h-4 w-4' /> Zavolat hned
                    </Button>
                  </div> */}
                </div>

                {/* <div className='mt-4 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='mb-2 flex items-center justify-center'>
                      <QrCode className='text-studio-gold mr-2 h-5 w-5' />
                      <span className='text-sm text-gray-500'>Naskenujte pro navigaci</span>
                    </div>
                    <img
                      src='https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maps.google.com/?q=Masážní+studio+Klidný+dotek+Květinová+25+Praha'
                      alt='QR kód pro navigaci'
                      className='mx-auto h-24 w-24'
                    />
                  </div>
                </div> */}
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

        <div className='mt-10 text-center font-serif text-gray-700 italic'>
          <p className='text-lg'>Těším se na Vaši návštěvu!</p>
        </div>
      </div>
    </section>
  )

  return (
    <section id={SECTION.CONTACT.id} className='bg-studio-beige px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='section-title'>Kde mě najdete?</h2>
        </div>

        <div className='mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row'>
          <div className='rounded-2xl bg-white p-6 shadow-sm lg:w-1/2'>
            {/* <h3 className='text-studio-pink mb-4 text-xl font-medium'>Kde nás najdete</h3> */}

            <div className='mb-6'>
              <h4 className='mb-2 font-medium text-gray-800'>Adresa</h4>
              <address className='text-gray-600 not-italic' dangerouslySetInnerHTML={{ __html: ADDRESS }} />
            </div>

            <div className='mb-6'>
              <h4 className='mb-2 font-medium text-gray-800'>Otevírací doba</h4>
              <ul className='text-gray-600'>
                <li className='mb-1 flex justify-between'>
                  <span>Pondělí - Pátek</span>
                  <span>{OPENING_HOURS_WORKDAYS}</span>
                </li>
                <li className='mb-1 flex justify-between'>
                  <span>Sobota</span>
                  <span>{OPENING_HOURS_SATURDAY}</span>
                </li>
                <li className='flex justify-between'>
                  <span>Neděle</span>
                  <span>{OPENING_HOURS_SUNDAY}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='mb-2 font-medium text-gray-800'>Kontaktní údaje</h4>
              <ul className='text-gray-600'>
                <li className='mb-2 flex items-center'>
                  <svg
                    className='text-studio-gold mr-2 h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                  </svg>
                  <span>{PHONE}</span>
                </li>
                <li className='flex items-center'>
                  <svg
                    className='text-studio-gold mr-2 h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                  <span>{EMAIL}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl shadow-sm lg:w-1/2'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3885048659795!2d17.12444661318573!3d48.850801601119265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47132e50d40a6673%3A0x15ea7a6c27e74db8!2zTsOhcm9kbsOtIHTFmS4gMzgzLzE1LCA2OTUgMDEgSG9kb27DrW4gMQ!5e0!3m2!1scs!2scz!4v1747158426680!5m2!1scs!2scz'
              width='600'
              height='450'
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
