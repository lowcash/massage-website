import React from 'react'

import { TitleSection } from '@/components/ui/typo'

import { EMAIL, PHONE, SECTIONS } from '@/config'

export default function About() {
  return (
    <section id={SECTIONS[2].id} className='mx-auto max-w-5xl rounded-lg bg-white p-5 shadow-lg'>
      <TitleSection>{SECTIONS[2].header}</TitleSection>

      <div className='flex'>
        <div className='relative'>
          <h1
            className='text-2xl tracking-wide text-gray-800'
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.5px',
            }}
          >
            {THERAPIST.name}
          </h1>

          <p
            className='text-sm text-gray-600 opacity-90'
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
              letterSpacing: '0.5px',
            }}
          >
            {THERAPIST.title}
          </p>

          <p className='font-light text-gray-600'>{THERAPIST.bio}</p>

          <div className='relative h-64 overflow-hidden'>
            <img src={THERAPIST.photo} alt={THERAPIST.name} />
          </div>
        </div>

        <div className='p-6'>
          <div className='mb-6 space-y-2'>
            {THERAPIST.qualities.map((quality, index) => (
              <div key={index} className='flex items-center'>
                <div className='mr-3 h-1.5 w-1.5 rounded-full bg-blue-400'></div>
                <span className='text-gray-700' dangerouslySetInnerHTML={{ __html: quality }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const THERAPIST = {
  name: 'Mgr. Radka Šebestová',
  title: 'Terapeutka a masérka',
  photo: 'https://pohlazenipoteleadusi.cz/img/photo.png',
  bio: 'Pomohu vám najít úlevu od bolesti a napětí prostřednictvím profesionálních masážních technik.',
  qualities: [
    'Dlouholetý <b>masér pro zdravotnictví a terapeut</b>',
    'Úspěšně ukončené <b>magisterské studium</b> ošetřovatelství na <b>VŠZaSP sv. Alžbety v Bratislavě</b>',
    '<b>Léta zkušeností</b> se zařízeními sociální a zdravotní péče',
    '<b>Učitelka</b> zdravotnických předmětů',
    'Lektor v <b>sociální sféře</b>',
    // "Specializace v oboru <b>geriatrie</b>",
  ],
  contact: {
    phone: PHONE,
    email: EMAIL,
  },
}
