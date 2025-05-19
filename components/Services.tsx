'use client'

import { useScrollToElement } from '@/hooks/useScrollToElement'

import { Flower, Heart, Droplet, Leaf, Sun, Sparkles } from 'lucide-react'
import { Description, H2 } from '@/style/typo'
import { SectionHeaderContainer } from '@/style/common'

import { SECTION } from '@/const'

export default function Services() {
  const scrollToCalendar = useScrollToElement()

  return (
    <section id={SECTION.SERVICES.id} className='bg-studio-beige/30 px-4 py-24'>
      <div className='mx-auto md:max-w-[45rem] lg:max-w-[62rem]'>
        <SectionHeaderContainer>
          <H2>Jak Vám můžu pomoci?</H2>
          <Description>
            Nabízím širokou škálu masáží a terapií přizpůsobených vašim individuálním potřebám pro dosažení harmonie
            těla i mysli.
          </Description>
        </SectionHeaderContainer>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className='service-card group relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1'
              onClick={() => scrollToCalendar(SECTION.CONTACT.id)}
              aria-label={`Vybrat masáž ${service.name}`}
            >
              <div className='flex h-full flex-col items-center p-10 md:p-12 lg:p-10'>
                <div className='mb-6 transition-transform duration-300 group-hover:rotate-3'>{service.icon}</div>
                <h3 className='text-studio-dark-green mb-3 font-serif text-3xl font-medium transition-colors md:text-2xl'>
                  {service.name}
                </h3>
                <p className='text-studio-dark-gray mb-4 font-serif text-lg font-light md:text-sm'>
                  {service.description}
                </p>
                <div className='mt-auto flex flex-col pt-6'>
                  <span className='block font-serif text-gray-500'>{service.duration}</span>
                  <span className='text-studio-gold font-serif text-xl font-medium'>{service.price}</span>
                </div>
              </div>
              <div className='absolute inset-0 bg-white/5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300'></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const LEAF = <Leaf className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />
const DROPLET = <Droplet className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />
const HEART = <Heart className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />
const SUN = <Sun className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />
const FLOWER = <Flower className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />
const SPARKES = <Sparkles className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />

const SERVICES = [
  {
    icon: LEAF,
    name: 'Thajská masáž nohou',
    description:
      'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a protahování pro uvolnění napětí a podporu celkového zdraví.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: DROPLET,
    name: 'Medová detoxikační masáž',
    description:
      'Relaxační technika, při které se pomocí teplého medu a speciálních hmatů odstraňují toxiny z těla a zlepšuje se prokrvení pokožky.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: HEART,
    name: 'Deep tissue massage',
    description:
      'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a pojivových tkáních pomocí pomalých, intenzivních tahů.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: SUN,
    name: 'Ošetření spoušťových bodů',
    description:
      'Terapeutická technika zaměřená na uvolnění svalových uzlů a zmírnění bolesti prostřednictvím tlaku na specifické body v těle.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: FLOWER,
    name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
    description:
      'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a pohybový aparát.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: SPARKES,
    name: 'Protimigrénová masáž',
    description:
      'Cílená relaxační technika zaměřená na uvolnění napětí v oblasti hlavy, krku a ramen s cílem zmírnit nebo předejít migrénám.',
    duration: '50 min',
    price: 'od 700,-',
  },
  {
    icon: LEAF,
    name: 'Spinální masáž',
    description:
      'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a zlepšuje funkci nervového systému.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: SUN,
    name: 'Baby masáže (3x)',
    description:
      'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a posilují vazbu mezi rodičem a dítětem.',
    duration: '45 min',
    price: '950,-',
  },
  {
    icon: DROPLET,
    name: 'Reflexní masáž zad a šíje',
    description:
      'Cílená masážní technika, která stimuluje nervové reflexní zóny k uvolnění napětí, zmírnění bolesti a podpoře regenerace v oblasti zad a šíje.',
    duration: '30 min',
    price: '500,-',
  },
  {
    icon: FLOWER,
    name: 'Těhotenská masáž',
    description:
      'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a zmírnit bolesti spojené s těhotenstvím.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: HEART,
    name: 'Kineziotaping',
    description:
      'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s cílem podpořit hojení, zmírnit bolest a zlepšit funkci svalů a kloubů.',
    price: '100,- (+2,- cm)',
  },
]
