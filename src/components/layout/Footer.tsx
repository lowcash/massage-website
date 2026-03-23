import { Facebook, Instagram } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const brandName = applyCzechNbsp(siteContent.brand.name)

  return (
    <footer className='bg-[#2d1d1a] text-[#f6ece9]'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 md:px-8'>
        <div className='grid gap-8 md:grid-cols-3 lg:gap-8 lg:grid-cols-3'>
          <div className='flex flex-col gap-3'>
            <p className='font-dancing text-3xl'>{brandName}</p>
            <p className='text-[15px] text-[#e4d4d0]'>{applyCzechNbsp(siteContent.footer.description)}</p>
            <p className='text-sm text-[#cdb8b3]'>
              © {currentYear} {brandName}. {applyCzechNbsp(siteContent.footer.rights)}
            </p>
          </div>

          <div className='flex flex-col gap-3'>
            <h3 className='font-dancing text-2xl text-[#f8e9e5]'>
              {siteContent.footer.openingHoursHeading}
            </h3>
            <div className='flex flex-col gap-1 text-[15px] text-[#ddc8c3]'>
              {siteContent.contact.openingHours.map((item) => (
                <p key={item.day} className='flex justify-between'>
                  <span>{item.day}:</span>
                  <span>{item.hours}</span>
                </p>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-3 text-[15px] text-[#ddc8c3]'>
            <h3 className='font-dancing text-2xl text-[#f8e9e5]'>{siteContent.footer.contactHeading}</h3>
            <a href={`mailto:${siteContent.brand.email}`} className='cursor-pointer transition hover:text-white'>
              {siteContent.brand.email}
            </a>
            <a href={`tel:+${siteContent.brand.phoneDigits}`} className='cursor-pointer transition hover:text-white'>
              {siteContent.brand.phone}
            </a>
            <a
              href={siteContent.brand.mapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className='cursor-pointer transition hover:text-white'
            >
              {siteContent.brand.addressLine1}
              <br />
              {siteContent.brand.addressLine2}
            </a>
          </div>
        </div>

        <div className='flex items-center justify-between border-t border-white/10 pt-7'>
          <p className='text-xs tracking-[0.16em] text-[#b89f9a] uppercase'>
            {siteContent.footer.cityLabel}
          </p>

          <div className='flex items-center gap-3'>
            <a
              href={siteContent.brand.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border border-white/20 p-2.5 transition hover:border-white/40 hover:bg-white/10'
              aria-label={siteContent.footer.facebookAriaLabel}
            >
              <Facebook className='h-5 w-5' />
            </a>
            <a
              href={siteContent.brand.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border border-white/20 p-2.5 transition hover:border-white/40 hover:bg-white/10'
              aria-label={siteContent.footer.instagramAriaLabel}
            >
              <Instagram className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
