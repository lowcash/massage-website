export default function About() {
  return (
    <section id='o-mne' className='px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-6 text-center'>
          <h2 className='section-title'>O mně</h2>
        </div>

        <div className='mx-auto flex max-w-5xl flex-col gap-12 md:flex-row'>
          <div className='flex flex-col md:w-1/2'>
            <h3 className='text-studio-dark-green mb-2 text-3xl font-medium'>Jana Nováková</h3>
            <p className='text-studio-gold mb-6 text-lg'>Terapeutka a masérka</p>
            <p className='mb-6 font-serif leading-relaxed text-gray-700'>
              Jmenuji se Jana Nováková a již 8 let pracuji jako certifikovaná masérka. Mou vášní je pomáhat lidem zbavit
              se bolesti a napětí, najít vnitřní klid a rovnováhu. Každý klient je pro mě jedinečný, a proto
              přizpůsobuji masáže individuálním potřebám.
            </p>

            <div className='mt-auto'>
              <div className='group relative mx-auto h-48 w-48 md:mx-0'>
                <div className='absolute inset-0 z-10 rounded-full bg-white/10 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100'></div>
                <div className='relative h-full w-full overflow-hidden rounded-full'>
                  <div className='pointer-events-none absolute inset-0 z-10 rounded-full bg-gradient-to-b from-transparent to-white/10'></div>
                  <div
                    className='absolute inset-0 rounded-full'
                    style={{
                      boxShadow: 'inset 0 0 20px 8px rgba(255,255,255,0.5)',
                      filter: 'feather(10px)',
                    }}
                  ></div>
                  <img
                    src='https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400'
                    alt='Jana Nováková'
                    className='h-full w-full rounded-full object-cover'
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='md:w-1/2'>
            <h3 className='text-studio-dark-green mb-6 text-2xl font-medium'>Něco málo o mně</h3>
            <ul className='space-y-4 font-serif'>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>Certifikovaná masérka</strong> s diplomem z Mezinárodní školy masáží, specializovaná na
                  relaxační a terapeutické techniky.
                </span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>8 let praxe</strong> v oboru s důrazem na individuální přístup ke každému klientovi.
                </span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>Specializace na thajské masáže</strong> získaná přímo v Bangkok Thai Massage School v Thajsku.
                </span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>Kurzy aromaterapie a práce s esenciálními oleji</strong> pro zvýšení účinnosti masážních
                  procedur.
                </span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>Neustálé vzdělávání</strong> v nových technikách a metodách pro dosažení maximálního efektu a
                  komfortu klientů.
                </span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='text-studio-gold mt-1 mr-3 h-5 w-5 flex-shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>
                  <strong>Zaměření na holistický přístup</strong> k tělu a mysli pro dosažení celkové harmonie a pohody.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
