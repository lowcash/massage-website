import React from 'react'

const SoftLightTherapistCard: React.FC = () => {
  // Data terapeuta
  const therapist = {
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
      phone: '+420 777 123 456',
      email: 'karolina@relaxace.cz',
    },
  }

  return (
    <div>
      <div className='relative'>
        {/* Fotografie s měkkým světelným efektem */}
        <div className='h-64 relative overflow-hidden'>
          {/* Základní fotografie */}
          <img
            src={therapist.photo}
            alt={therapist.name}
            // className="w-full h-full object-cover filter contrast-75 brightness-110"
          />

          {/* Soft light overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-60"></div> */}

          {/* Světelné body */}
          {/* <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-yellow-100/40 blur-2xl mix-blend-soft-light"></div> */}

          <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
            <h1
              className='text-2xl font-light tracking-wide'
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                letterSpacing: '0.5px',
              }}
            >
              {therapist.name}
            </h1>
            <p
              className='text-sm opacity-90 font-light'
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                letterSpacing: '0.5px',
              }}
            >
              {therapist.title}
            </p>
          </div>
        </div>
      </div>

      <div className='p-6'>
        {/* Popis */}
        <p className='text-gray-600 mb-6 font-light leading-relaxed'>{therapist.bio}</p>

        {/* Vlastnosti */}
        <div className='space-y-2 mb-6'>
          {therapist.qualities.map((quality, index) => (
            <div key={index} className='flex items-center'>
              <div className='w-1.5 h-1.5 rounded-full bg-blue-400 mr-3'></div>
              <span className='text-gray-700' dangerouslySetInnerHTML={{ __html: quality }} />
            </div>
          ))}
        </div>

        {/* Kontakt */}
        <div className='flex flex-wrap gap-3 mt-4 border-t border-gray-100 pt-4'>
          <a
            href={`tel:${therapist.contact.phone}`}
            className='inline-flex items-center text-sm text-gray-700 hover:text-blue-600'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-2 text-blue-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
            {therapist.contact.phone}
          </a>

          <a
            href={`mailto:${therapist.contact.email}`}
            className='inline-flex items-center text-sm text-gray-700 hover:text-blue-600'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-2 text-blue-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
            {therapist.contact.email}
          </a>
        </div>
      </div>
    </div>
  )
}

export default SoftLightTherapistCard
