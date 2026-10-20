import { Facebook, Instagram } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const brandName = applyCzechNbsp(siteContent.brand.name)

  return (
    <footer className='bg-night text-surface px-5 md:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 py-12'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-1'>
            <p className='font-dancing text-3xl'>{brandName}</p>
            <p className='text-base text-white/80'>{applyCzechNbsp(siteContent.footer.description)}</p>
          </div>

          <div className='flex items-center gap-3'>
            <a
              href={siteContent.brand.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border border-white/20 p-2.5 transition-colors duration-300 ease-out hover:border-white/40 hover:bg-white/10'
              aria-label={siteContent.footer.facebookAriaLabel}
            >
              <Facebook className='h-5 w-5' />
            </a>
            <a
              href={siteContent.brand.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border border-white/20 p-2.5 transition-colors duration-300 ease-out hover:border-white/40 hover:bg-white/10'
              aria-label={siteContent.footer.instagramAriaLabel}
            >
              <Instagram className='h-5 w-5' />
            </a>
          </div>
        </div>

        <div className='flex flex-col gap-1 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/65 sm:flex-row sm:justify-between sm:gap-6'>
          <p>
            © {currentYear} {brandName}. {applyCzechNbsp(siteContent.footer.rights)}
          </p>
          <p>{applyCzechNbsp(siteContent.footer.analyticsDisclosure)}</p>
        </div>
      </div>
    </footer>
  )
}
