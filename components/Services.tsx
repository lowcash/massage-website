import {
  Footprints,
  BicepsFlexed,
  Target,
  AlignCenter,
  Brain,
  ChartNoAxesGantt,
  Baby,
  Move3D,
  Scissors,
  Droplet,
  Heart,
} from 'lucide-react'
import { Description, H2 } from '@/styles/typo'
import { SectionHeaderContainer } from '@/styles/common'
import ServiceItem from '@/components/ServiceItem'

import { SECTION } from '@/const'

export default function Services() {
  return (
    <section id={SECTION.SERVICES.id} className='bg-studio-beige/30 px-4 py-24'>
      <div className='mx-auto md:max-w-[45rem] lg:max-w-[62rem]'>
        <SectionHeaderContainer>
          <H2>Jak Vám můžu pomoci?</H2>
          <Description
            dangerouslySetInnerHTML={{
              __html: `Nabízím širokou škálu masáží a&nbsp;terapií přizpůsobených vašim individuálním potřebám pro dosažení harmonie těla i&nbsp;mysli.`,
            }}
          />
        </SectionHeaderContainer>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.map((service, index) => (
            <ServiceItem key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

const SERVICES: React.ComponentProps<typeof ServiceItem>[] = [
  {
    icon: <Target className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Ošetření spoušťových bodů',
    description:
      'Terapeutická technika zaměřená na uvolnění svalových uzlů a&nbsp;zmírnění bolesti prostřednictvím tlaku na specifické body v&nbsp;těle.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: <AlignCenter className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
    description:
      'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a&nbsp;pohybový aparát.',
    duration: '50 min',
    price: 'od 750,-',
  },
  {
    icon: <Footprints className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Thajská masáž nohou',
    description:
      'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a&nbsp;protahování pro uvolnění napětí a&nbsp;podporu celkového zdraví.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Droplet className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Medová detoxikační masáž',
    description:
      'Relaxační technika, při které se pomocí teplého medu a&nbsp;speciálních hmatů odstraňují toxiny z&nbsp;těla a&nbsp;zlepšuje se prokrvení pokožky.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: <BicepsFlexed className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Deep tissue massage',
    description:
      'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a&nbsp;pojivových tkáních pomocí pomalých, intenzivních tahů.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Brain className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Protimigrénová masáž',
    description:
      'Cílená relaxační technika zaměřená na uvolnění napětí v&nbsp;oblasti hlavy, krku a&nbsp;ramen s&nbsp;cílem zmírnit nebo předejít migrénám',
    duration: '50 min',
    price: 'od 700,-',
  },
  {
    icon: <ChartNoAxesGantt className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Spinální masáž',
    description:
      'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a&nbsp;zlepšuje funkci nervového systému.',
    duration: '60 min',
    price: 'od 800,-',
  },
  {
    icon: <Baby className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Baby masáže (3x)',
    description:
      'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a&nbsp;posilují vazbu mezi rodičem a&nbsp;dítětem.',
    duration: '45 min',
    price: '950,-',
  },
  {
    icon: <Move3D className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Reflexní masáž zad a šíje',
    description:
      'Cílená masážní technika, která stimuluje nervové reflexní zóny k&nbsp;uvolnění napětí, zmírnění bolesti a&nbsp;podpoře regenerace v&nbsp;oblasti zad a&nbsp;šíje.',
    duration: '30 min',
    price: '500,-',
  },
  {
    icon: <Heart className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Těhotenská masáž',
    description:
      'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a&nbsp;zmírnit bolesti spojené s&nbsp;těhotenstvím.',
    duration: '60 min',
    price: 'od 850,-',
  },
  {
    icon: <Scissors className='text-studio-gold h-12 w-12 transition-all duration-300 group-hover:scale-110' />,
    name: 'Kineziotaping',
    description:
      'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s&nbsp;cílem podpořit hojení, zmírnit bolest a&nbsp;zlepšit funkci svalů a&nbsp;kloubů.',
    price: '100,- (+2,- cm)',
  },
]
