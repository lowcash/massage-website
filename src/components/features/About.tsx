import type { ReactNode } from 'react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { cn } from '@/lib/utils'

import AboutPortrait from '@/src/components/features/AboutPortrait'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import CountUpValue from '@/src/components/shared/CountUpValue'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

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
  return (
    <section id='about' className='bg-band py-[var(--spacing-s6)]'>
      <div
        className={cn(
          CONTENT_SHELL,
          'grid items-start gap-[var(--spacing-s5)] min-[56rem]:grid-cols-[0.8fr_1.2fr] min-[56rem]:gap-[var(--spacing-s6)]',
        )}
      >
        {/* Offset tint block sits behind the portrait; sticky on wide screens. */}
        <div className='reveal relative isolate max-w-[26rem] min-[56rem]:sticky min-[56rem]:top-[calc(var(--navigation-offset)+2rem)]'>
          <div
            aria-hidden='true'
            className='bg-surface-alt absolute top-5 right-[-1rem] bottom-[-1.25rem] left-5 -z-10 rounded-(--radius-lg)'
          />
          <AboutPortrait />
        </div>

        <div className='grid gap-[var(--spacing-s3)]'>
          <SectionIntro id='about-heading' title={siteContent.about.heading} subtitle={siteContent.about.subtitle} />

          <div className='reveal-soft flex flex-col gap-1'>
            <h3 className='text-ink text-[length:var(--text-fluid-2)]'>
              {applyCzechNbsp(siteContent.brand.therapistName)}
            </h3>
            <p className='text-brand text-[length:var(--text-fluid--1)] font-semibold tracking-[0.12em] uppercase'>
              {applyCzechNbsp(siteContent.about.role)}
            </p>
          </div>

          <div className='reveal-soft text-body flex flex-col gap-4'>
            {siteContent.about.paragraphs.map((paragraph, index) => (
              <p key={paragraph}>{renderEmphasizedText(paragraph, ABOUT_PARAGRAPH_EMPHASIS[index])}</p>
            ))}
          </div>

          <div className='reveal-soft border-line grid grid-cols-3 gap-[var(--spacing-s2)] border-y py-[var(--spacing-s3)]'>
            {siteContent.about.stats.map((stat) => (
              <div key={stat.id}>
                <p className='font-display text-brand text-[length:var(--text-fluid-3)] leading-none font-[380] whitespace-nowrap [font-variant-numeric:lining-nums] [font-variation-settings:"SOFT"_100,"opsz"_144]'>
                  <CountUpValue value={stat.value} suffix={stat.suffix} />
                </p>
                <p className='text-muted-ink mt-1.5 text-[length:var(--text-fluid--1)] leading-snug'>
                  {applyCzechNbsp(stat.label)}
                </p>
              </div>
            ))}
          </div>

          <details className='reveal-soft group border-line bg-paper rounded-(--radius-md) border px-5 py-4'>
            <summary className='text-ink flex min-h-8 cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden'>
              {siteContent.about.credentialsHeading}
              <span
                aria-hidden='true'
                className='font-display text-brand text-2xl leading-none transition-transform duration-260 ease-(--ease-out) group-open:rotate-45'
              >
                +
              </span>
            </summary>
            <ul className='text-body mt-3.5 grid list-disc gap-2 pl-5 text-[length:var(--text-fluid--1)]'>
              {siteContent.about.credentials.map((credential) => (
                <li key={credential}>{renderEmphasizedText(credential, ABOUT_CREDENTIAL_EMPHASIS[credential])}</li>
              ))}
            </ul>
          </details>

          <p className='reveal-soft font-dancing text-brand text-[length:var(--text-fluid-2)] leading-tight text-balance'>
            {bindTail(applyCzechNbsp(siteContent.about.closingLine))}
          </p>
        </div>
      </div>
    </section>
  )
}
