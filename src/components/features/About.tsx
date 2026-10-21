'use client'

import { type ReactNode, useEffect, useState } from 'react'

import Image from 'next/image'

import { X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, bindTail } from '@/lib/typography'

import profileImage from '@/src/assets/profile.jpg'
import CountUpValue from '@/src/components/shared/CountUpValue'
import { SectionIntro } from '@/src/components/shared/SectionIntro'
import { useInView } from '@/src/hooks/useInView'
import { useReducedMotion } from '@/src/hooks/useReducedMotion'

const ABOUT_PARAGRAPH_EMPHASIS = [
  'vykouzlit druhým na tváři úsměv',
  'zapomněli na každodenní starosti',
  'jedinečné bytosti',
]

const ABOUT_CREDENTIAL_EMPHASIS: Record<string, string> = {
  'Magisterské studium ošetřovatelství na VŠZaSP sv. Alžbety v Bratislavě': 'Magisterské studium ošetřovatelství',
  'Specializace v oboru geriatrie': 'geriatrie',
  'Dlouholetý masér pro zdravotnictví a terapeut': 'Dlouholetý masér',
  'Zajišťuji zdravotní dozor a první pomoc na akcích': 'zdravotní dozor a první pomoc',
  'Zkušenosti se zařízeními sociální a zdravotní péče': 'sociální a zdravotní péče',
  'Učitelka zdravotnických předmětů': 'Učitelka',
  'Lektor v sociální sféře': 'Lektor',
}

function renderEmphasizedText(text: string, emphasis?: string): ReactNode {
  if (!emphasis || !text.includes(emphasis)) {
    return applyCzechNbsp(text)
  }

  const [before, ...afterParts] = text.split(emphasis)
  const after = afterParts.join(emphasis)

  return (
    <>
      {applyCzechNbsp(before)}
      <strong className='text-ink font-semibold'>{applyCzechNbsp(emphasis)}</strong>
      {applyCzechNbsp(after)}
    </>
  )
}

export default function About() {
  const shouldReduceMotion = useReducedMotion()
  const intro = useInView()
  const content = useInView()
  const image = useInView()
  const [isPortraitOpen, setIsPortraitOpen] = useState(false)

  const fadeIn = 'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  const hidden = shouldReduceMotion ? '' : 'opacity-0 translate-y-4'

  useEffect(() => {
    if (!isPortraitOpen) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPortraitOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isPortraitOpen])

  return (
    <section id='about' className='bg-surface px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <div ref={intro.ref} className={`${fadeIn} ${!intro.inView ? hidden : ''}`}>
          <SectionIntro id='about-heading' title={siteContent.about.heading} subtitle={siteContent.about.subtitle} />
        </div>

        <div className='bg-paper shadow-soft grid items-start gap-7 rounded-3xl p-6 md:p-10 lg:grid-cols-2 lg:items-stretch'>
          <div
            ref={content.ref}
            className={`order-2 flex h-full flex-col gap-7 md:order-2 ${fadeIn} ${!content.inView ? hidden : ''}`}
            style={{ transitionDelay: content.inView ? '200ms' : '0ms' }}
          >
            <div className='flex flex-col gap-1'>
              <h3 className='font-display text-ink text-[2rem]'>{applyCzechNbsp(siteContent.brand.therapistName)}</h3>
              <p className='text-brand text-base tracking-[0.12em] uppercase'>
                {applyCzechNbsp(siteContent.about.role)}
              </p>
            </div>

            <div className='text-body flex flex-col gap-4 text-base leading-relaxed'>
              {siteContent.about.paragraphs.map((paragraph, index) => (
                <p key={paragraph}>{renderEmphasizedText(paragraph, ABOUT_PARAGRAPH_EMPHASIS[index])}</p>
              ))}
            </div>

            <div className='border-line grid grid-cols-3 gap-2 border-t pt-5 sm:gap-4'>
              {siteContent.about.stats.map((stat) => (
                <div key={stat.id} className='flex flex-col items-center text-center'>
                  <p className='font-dancing text-brand text-4xl sm:text-5xl'>
                    <CountUpValue value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className='text-body text-xs leading-relaxed uppercase'>{applyCzechNbsp(stat.label)}</p>
                </div>
              ))}
            </div>

            <div className='border-line flex flex-col gap-3 border-t pt-5'>
              {siteContent.about.credentials.map((credential) => (
                <div key={credential} className='text-body flex items-start gap-3 text-base leading-relaxed'>
                  <span className='bg-brand mt-2 block h-1.5 w-1.5 shrink-0 rounded-full' />
                  <span>{renderEmphasizedText(credential, ABOUT_CREDENTIAL_EMPHASIS[credential])}</span>
                </div>
              ))}

              <p className='font-dancing text-brand pt-3 text-3xl leading-snug text-balance'>
                {bindTail(applyCzechNbsp(siteContent.about.closingLine))}
              </p>
            </div>
          </div>

          <div
            ref={image.ref}
            className={`order-1 md:order-1 md:mx-auto md:w-full md:max-w-2xl lg:h-full lg:max-w-none ${fadeIn} ${!image.inView ? hidden : ''}`}
            style={{ transitionDelay: image.inView ? '300ms' : '0ms' }}
          >
            <button
              type='button'
              onClick={() => setIsPortraitOpen(true)}
              aria-label={`Zvětšit portrét: ${siteContent.brand.therapistName}`}
              className={`bg-surface-alt group block w-full cursor-zoom-in overflow-hidden rounded-3xl text-left transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-full lg:max-h-none ${image.inView || shouldReduceMotion ? '[clip-path:inset(0_0_0_0_round_1.5rem)]' : '[clip-path:inset(0_0_100%_0_round_1.5rem)]'}`}
            >
              <Image
                src={profileImage}
                alt={siteContent.brand.therapistName}
                className='h-auto w-full object-cover object-top transition-[filter] duration-500 ease-out group-hover:brightness-[1.03] lg:h-full lg:max-h-none'
                sizes='(min-width: 1024px) 50vw, (min-width: 768px) 42rem, 100vw'
                priority={false}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        role='dialog'
        aria-modal='true'
        aria-label={`Portrét: ${siteContent.brand.therapistName}`}
        inert={!isPortraitOpen || undefined}
        className={`fixed inset-0 z-80 flex cursor-default items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-opacity duration-300 md:p-8 ${isPortraitOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsPortraitOpen(false)}
      >
        <div
          className={`relative flex max-h-[90vh] w-full max-w-lg cursor-default items-center justify-center transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isPortraitOpen ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'}`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type='button'
            onClick={() => setIsPortraitOpen(false)}
            className='absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition-colors duration-300 ease-out hover:bg-black/65'
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
      </div>
    </section>
  )
}
