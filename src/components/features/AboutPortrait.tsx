'use client'

import { useCallback, useState } from 'react'

import Image from 'next/image'

import { X } from 'lucide-react'

import { siteContent } from '@/lib/content'

import profileImage from '@/src/assets/profile.jpg'
import { Dialog } from '@/src/components/shared/Dialog'

/** Portrait with an enlarge dialog. The only client part of the About section (besides the count-up). */
export default function AboutPortrait() {
  const [isPortraitOpen, setIsPortraitOpen] = useState(false)
  const closePortrait = useCallback(() => setIsPortraitOpen(false), [])

  return (
    <>
      <div className='bg-surface-alt aspect-4/5 overflow-hidden rounded-(--radius-lg)'>
        <button
          type='button'
          onClick={() => setIsPortraitOpen(true)}
          aria-label={`Zvětšit portrét: ${siteContent.brand.therapistName}`}
          className='relative block h-full w-full cursor-zoom-in overflow-hidden text-left'
        >
          <Image
            src={profileImage}
            alt={siteContent.brand.therapistName}
            fill
            className='photo-soft object-cover object-[60%_30%]'
            sizes='(min-width: 56rem) 32vw, (min-width: 34rem) 26rem, 100vw'
          />
        </button>
      </div>

      <Dialog
        open={isPortraitOpen}
        onClose={closePortrait}
        label={`Portrét: ${siteContent.brand.therapistName}`}
        className='z-80 cursor-default md:p-8'
        backdropClassName='z-80'
      >
        <div
          className={`relative flex max-h-[90vh] w-full max-w-lg cursor-default items-center justify-center transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isPortraitOpen ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'}`}
        >
          <button
            type='button'
            onClick={closePortrait}
            className='absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white transition-colors duration-300 ease-out hover:bg-black/65'
            aria-label='Zavřít náhled'
          >
            <X className='h-5 w-5' />
          </button>

          <div className='relative aspect-3/4 max-h-[90vh] w-full overflow-hidden rounded-2xl'>
            {isPortraitOpen && (
              <Image
                src={profileImage}
                alt={siteContent.brand.therapistName}
                fill
                placeholder='blur'
                quality={90}
                className='object-cover object-top'
                sizes='(min-width: 512px) 32rem, 92vw'
                priority
              />
            )}
          </div>
        </div>
      </Dialog>
    </>
  )
}
