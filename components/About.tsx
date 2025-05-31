import Image from 'next/image'
import { Check } from 'lucide-react'
import { H2 } from '@/styles/typo'
import { SectionHeaderContainer } from '@/styles/common'

import PROFILE_IMG from '@/app/assets/profile.jpeg'
import { SECTION, THERAPIST_NAME } from '@/const'

export default function About() {
  return (
    <section id={SECTION.ABOUT.id} className='bg-[#fef9fb] px-5 py-24'>
      <div className='container mx-auto md:max-w-[45rem] lg:max-w-[62rem]'>
        <SectionHeaderContainer>
          <H2>Něco málo o mně</H2>
        </SectionHeaderContainer>

        <div className='mx-auto mb-20 flex max-w-6xl flex-col items-start gap-16 md:flex-row'>
          <div className='flex w-full flex-col md:w-3/5'>
            <h3 className='text-studio-dark-green mb-4 font-sans text-3xl font-medium md:text-4xl'>{THERAPIST_NAME}</h3>
            <p className='text-studio-pink mb-8 font-sans text-xl font-light tracking-wide'>Terapeutka a masérka</p>
            <div className='mb-10 space-y-8 text-lg leading-relaxed text-gray-700'>
              <p>
                Jsem mladá žena s&nbsp;chutí žít život naplno. Cítím, že mým posláním je vykouzlit druhým na&nbsp;tváři
                úsměv.
                <br />
                Ráda bych, abyste se mnou zapomněli na&nbsp;každodenní starosti a&nbsp;užili si chvíli určenou jen
                a&nbsp;jen vám.
                <br />
                Ke&nbsp;každému člověku se snažím přistupovat jako k&nbsp;jedinečné bytosti.
              </p>
            </div>

            <div className='text-studio-pink font-dancing mt-0 text-3xl italic md:text-2xl lg:mt-8'>
              Těším se na Vaši návštěvu
            </div>
          </div>

          <div className='order-first flex w-full justify-center md:order-last md:w-2/5 md:justify-end'>
            <div className='relative h-auto w-full md:h-[24rem] md:w-80'>
              <Image
                src={PROFILE_IMG.src}
                alt={THERAPIST_NAME}
                width={640}
                height={640}
                className='fade-rect-mask h-full w-full object-cover transition-all duration-300 hover:shadow-md'
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.04))',
                }}
                priority
              />
              <div
                className='absolute inset-0'
                style={{
                  boxShadow: 'inset 0 0 25px 20px rgba(255,255,255,0.3)',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className='mx-auto max-w-5xl'>
          <h3 className='text-studio-dark-green mb-10 font-sans text-3xl font-medium md:text-4xl'>
            Vzdělání & zkušenosti
          </h3>
          <ul className='space-y-10 font-sans text-lg'>
            {QUALITIES.map((x, idx) => (
              <li key={idx} className='flex items-start'>
                <div className='mt-1.5 mr-5 flex-shrink-0 rounded-full bg-[#fddce4] p-1.5'>
                  <Check className='text-studio-pink h-5 w-5 stroke-[1.5]' />
                </div>
                <span className='leading-relaxed text-gray-700'>
                  <span className='font-bold' dangerouslySetInnerHTML={{ __html: x }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const QUALITIES = [
  'Úspěšně ukončené <strong>magisterské studium</strong> ošetřovatelství na&nbsp;<strong>VŠZaSP&nbsp;sv.&nbsp;Alžbety v&nbsp;Bratislavě</strong>',
  'Specializace v&nbsp;oboru <strong>geriatrie</strong>',
  'Dlouholetý <strong>masér pro zdravotnictví a&nbsp;terapeut</strong> i&nbsp;v&nbsp;oblasti geriatrické fyzioterapie',
  '<strong>Léta zkušeností</strong> se&nbsp;zařízeními sociální a&nbsp;zdravotní péče',
  '<strong>Učitelka</strong> zdravotnických předmětů',
  'Lektor v&nbsp;<strong>sociální sféře</strong>',
]
