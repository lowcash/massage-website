import React from 'react'

import { TitleSection } from '@/components/ui/typo'

import { EMAIL, PHONE, SECTIONS } from '@/config'

export default function About() {
  return (
    <section id={SECTIONS[2].id} className='bg-white rounded-lg shadow-lg max-w-5xl mx-auto p-5'>
      <TitleSection>{SECTIONS[2].header}</TitleSection>

      <div className='flex'>
        <div className='relative'>
          <h1
            className='text-2xl text-gray-800 tracking-wide'
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

          <p className='text-gray-600 font-light'>{THERAPIST.bio}</p>

          <div className='h-64 relative overflow-hidden'>
            <img src={THERAPIST.photo} alt={THERAPIST.name} />
          </div>
        </div>

        <div className='p-6'>
          <div className='space-y-2 mb-6'>
            {THERAPIST.qualities.map((quality, index) => (
              <div key={index} className='flex items-center'>
                <div className='w-1.5 h-1.5 rounded-full bg-blue-400 mr-3'></div>
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
