'use client'

import { useScrollToElement } from '@/hooks/useScrollToElement'

import { Leaf, Flower } from 'lucide-react'

import { SECTION } from '@/const'

export default function Services() {
  const scrollToCalendar = useScrollToElement()

  return (
    <section id={SECTION.SERVICES.id} className='px-4 py-20'>
      <div className='mx-auto max-w-[65rem]'>
        <div className='mb-12 text-center'>
          <h2 className='section-title'>S čím vám mohu pomoci?</h2>
          {/* <p className='mx-auto max-w-2xl font-sans text-gray-600'>
            Nabízíme širokou škálu masáží a relaxačních procedur, které vám pomohou obnovit energii a najít vnitřní
            klid.
          </p> */}
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.map((service, index) => (
            <div key={index} className='service-card group' onClick={() => scrollToCalendar(SECTION.ABOUT.id)}>
              <div className='mb-4'>{service.icon}</div>
              <h3 className='service-title'>{service.name}</h3>
              <p className='service-description'>{service.description}</p>
              <div className='service-details'>
                {service.duration} – {service.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
  {
    icon: <Leaf className='text-studio-gold h-8 w-8' />,
    name: 'Thajská masáž nohou',
    description:
      'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a protahování pro uvolnění napětí a podporu celkového zdraví.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Medová detoxikační masáž',
    description:
      'Relaxační technika, při které se pomocí teplého medu a speciálních hmatů odstraňují toxiny z těla a zlepšuje se prokrvení pokožky.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Deep tissue massage',
    description:
      'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a pojivových tkáních pomocí pomalých, intenzivních tahů.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Ošetření spoušťových bodů',
    description:
      'Terapeutická technika zaměřená na uvolnění svalových uzlů a zmírnění bolesti prostřednictvím tlaku na specifické body v těle.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
    description:
      'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a pohybový aparát.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Protimigrénová masáž',
    description:
      'Cílená relaxační technika zaměřená na uvolnění napětí v oblasti hlavy, krku a ramen s cílem zmírnit nebo předejít migrénám.',
    duration: '50 min',
    price: 'od 700,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Spinální masáž',
    description:
      'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a zlepšuje funkci nervového systému.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Baby masáže (3x)',
    description:
      'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a posilují vazbu mezi rodičem a dítětem.',
    duration: '45 min',
    price: '950,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Reflexní masáž zad a šíje',
    description:
      'Cílená masážní technika, která stimuluje nervové reflexní zóny k uvolnění napětí, zmírnění bolesti a podpoře regenerace v oblasti zad a šíje.',
    duration: '30 min',
    price: '500,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Těhotenská masáž',
    description:
      'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a zmírnit bolesti spojené s těhotenstvím.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Kineziotaping',
    description:
      'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s cílem podpořit hojení, zmírnit bolest a zlepšit funkci svalů a kloubů.',
    price: '100,- (+2,- cm)',
  },
]
