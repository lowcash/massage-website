import { Facebook, Instagram } from 'lucide-react'
import {
  OPENING_HOURS_WORKDAYS,
  OPENING_HOURS_SATURDAY,
  OPENING_HOURS_SUNDAY,
  EMAIL,
  PHONE,
  NAME,
  FACEBOOK,
  INSTAGRAM,
} from '@/const'

export default function Footer() {
  return (
    <footer className='bg-[#2c2c2c] text-white py-16 px-6 md:px-16'>
      <div className='container mx-auto max-w-5xl'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Business Info */}
          <div>
            <div className='mb-4'>
              <span className='text-xl' style={{ fontFamily: 'Dancing Script' }}>
                {NAME}
              </span>
            </div>
            <p className='text-[#e0e0e0] mb-4'>Masáže a terapie těla</p>
            <p className='text-[#e0e0e0] text-sm'>
              © {new Date().getFullYear()} {NAME}.
              <br />
              Všechna práva vyhrazena.
            </p>
          </div>

          {/* Otevírací doba */}
          <div>
            <h3 className='text-xl mb-4' style={{ fontFamily: 'Dancing Script' }}>
              Otevírací doba
            </h3>
            <div className='space-y-2 text-[#e0e0e0]'>
              <div className='flex justify-between'>
                <span>Po-Pá:</span>
                <span>{OPENING_HOURS_WORKDAYS}</span>
              </div>
              <div className='flex justify-between'>
                <span>So:</span>
                <span>{OPENING_HOURS_SATURDAY}</span>
              </div>
              <div className='flex justify-between'>
                <span>Ne:</span>
                <span>{OPENING_HOURS_SUNDAY}</span>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className='text-xl mb-4' style={{ fontFamily: 'Dancing Script' }}>
              Kontakt
            </h3>
            <div className='space-y-3 text-[#e0e0e0]'>
              <p>
                <span className='text-[#c4a75f]'>Email:</span>
                <br />
                <a href={`mailto:${EMAIL}`} className='hover:text-[#de397e] transition-colors'>
                  {EMAIL}
                </a>
              </p>
              <p>
                <span className='text-[#c4a75f]'>Telefon:</span>
                <br />
                <a href={`tel:${PHONE}`} className='hover:text-[#de397e] transition-colors'>
                  {PHONE}
                </a>
              </p>
              <p>
                <span className='text-[#c4a75f]'>Adresa:</span>
                <br />
                Národní třída 383/15
                <br />
                Hodonín, 695 01
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className='pt-8 border-t border-white/10'>
          <div className='flex items-center justify-center gap-6'>
            <a
              href={FACEBOOK}
              target='_blank'
              rel='noopener noreferrer'
              className='p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all'
              aria-label='Facebook'
            >
              <Facebook className='w-6 h-6' />
            </a>
            <a
              href={INSTAGRAM}
              target='_blank'
              rel='noopener noreferrer'
              className='p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all'
              aria-label='Instagram'
            >
              <Instagram className='w-6 h-6' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
