import { SECTION } from '@/const'

export default function About() {
  return (
    <section id={SECTION.ABOUT.id} className='px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-6 text-center'>
          <h2 className='section-title'>Něco málo o mně</h2>
        </div>

        <div className='mx-auto flex max-w-5xl flex-col gap-12 md:flex-row'>
          <div className='flex flex-col md:w-1/2'>
            <h3 className='text-studio-dark-green mb-2 text-3xl font-medium'>{ABOUT.name}</h3>
            <p className='text-studio-gold mb-6 text-lg'>{ABOUT.title}</p>
            <p className='mb-6 font-serif leading-relaxed text-gray-700'>{ABOUT.bio}</p>

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
                    src={ABOUT.photo}
                    alt={ABOUT.name}
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
            {/* <h3 className='text-studio-dark-green mb-6 text-2xl font-medium'>Něco málo o mně</h3> */}
            <ul className='space-y-4 font-serif'>
              {ABOUT.qualities.map((x, idx) => (
                <li key={idx} className='flex items-start'>
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
                  <span className='text-gray-700' dangerouslySetInnerHTML={{ __html: x }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const ABOUT = {
  name: 'Mgr. Radka Šebestová',
  title: 'Terapeutka a masérka',
  photo: 'https://pohlazenipoteleadusi.cz/img/photo.png',
  bio: 'Jsem mladá žena s chutí žít život naplno. Cítím, že mým posláním je vykouzlit druhým na tváři úsměv. Ráda bych, abyste se mnou zapomněli na každodenní starosti a užili si chvíli určenou jen a jen vám. Ke každému člověku se snažím přistupovat jako k jedinečné bytosti.',
  qualities: [
    'Dlouholetý <strong>masér pro zdravotnictví a terapeut</strong>',
    'Úspěšně ukončené <strong>magisterské studium</strong> ošetřovatelství na <strong>VŠZaSP sv. Alžbety v Bratislavě</strong>',
    '<strong>Léta zkušeností</strong> se zařízeními sociální a zdravotní péče',
    '<strong>Učitelka</strong> zdravotnických předmětů',
    'Lektor v <strong>sociální sféře</strong>',
    // "Specializace v oboru <b>geriatrie</b>",
  ],
}

// Těším se na Vaší návštěvu. // TODO missing
