'use client'

import { motion } from 'framer-motion';
import { useBooking } from '@/src/contexts/BookingContext';
import { useReducedMotion, getAnimationConfig, getAnimationConfigWithDelay } from '@/src/hooks/useReducedMotion';
import { 
  Target, 
  AlignCenter, 
  Footprints, 
  Droplet, 
  Zap, 
  Brain, 
  Activity, 
  Baby,
  HandMetal,
  Heart,
  Scissors
} from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Ošetření spoušťových bodů',
    description: 'Terapeutická technika zaměřená na uvolnění svalových uzlů a zmírnění bolesti prostřednictvím tlaku na specifické body v těle.',
    duration: '50 min',
    price: 'od 750,-',
    icon: Target,
  },
  {
    id: 2,
    name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
    description: 'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a pohybový aparát.',
    duration: '50 min',
    price: 'od 750,-',
    icon: AlignCenter,
  },
  {
    id: 3,
    name: 'Thajská masáž nohou',
    description: 'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a protahování pro uvolnění napětí a podporu celkového zdraví.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Footprints,
  },
  {
    id: 4,
    name: 'Medová detoxikační masáž',
    description: 'Relaxační technika, při které se pomocí teplého medu a speciálních hmatů odstraňují toxiny z těla a zlepšuje se prokrvení pokožky.',
    duration: '60 min',
    price: 'od 800,-',
    icon: Droplet,
  },
  {
    id: 5,
    name: 'Deep tissue massage',
    description: 'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a pojivových tkáních pomocí pomalých, intenzivních tahů.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Zap,
  },
  {
    id: 6,
    name: 'Protimigrénová masáž',
    description: 'Cílená relaxační technika zaměřená na uvolnění napětí v oblasti hlavy, krku a ramen s cílem zmírnit nebo předejít migrénám.',
    duration: '50 min',
    price: 'od 700,-',
    icon: Brain,
  },
  {
    id: 7,
    name: 'Spinální masáž',
    description: 'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a zlepšuje funkci nervového systému.',
    duration: '60 min',
    price: 'od 800,-',
    icon: Activity,
  },
  {
    id: 8,
    name: 'Baby masáže (3x)',
    description: 'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a posilují vazbu mezi rodičem a dítětem.',
    duration: '45 min',
    price: '950,-',
    icon: Baby,
  },
  {
    id: 9,
    name: 'Reflexní masáž zad a šíje',
    description: 'Cílená masážní technika, která stimuluje nervové reflexní zóny k uvolnění napětí, zmírnění bolesti a podpoře regenerace v oblasti zad a šíje.',
    duration: '30 min',
    price: '500,-',
    icon: HandMetal,
  },
  {
    id: 10,
    name: 'Těhotenská masáž',
    description: 'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a zmírnit bolesti spojené s těhotenstvím.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Heart,
  },
  {
    id: 11,
    name: 'Kineziotaping',
    description: 'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s cílem podpořit hojení, zmírnit bolest a zlepšit funkci svalů a kloubů.',
    duration: '',
    price: '100,- (+15,- cm)',
    icon: Scissors,
  },
];

export default function Services() {
  const { setSelectedService } = useBooking();
  const shouldReduceMotion = useReducedMotion();
  
  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-32 px-6 md:px-16 bg-gradient-to-b from-white via-[#fef8fb] to-white">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          {...getAnimationConfig(shouldReduceMotion)}
          className="text-center text-[#de397e] mb-6 tracking-wider"
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Jak Vám můžu pomoci?
        </motion.h2>

        <motion.p
          {...getAnimationConfigWithDelay(shouldReduceMotion, 0.15)}
          className="text-center text-[#666666] mb-20 max-w-3xl mx-auto text-lg leading-loose"
        >
          Nabízím širokou škálu masáží a terapií přizpůsobených vašim individuálním potřebám pro dosažení harmonie těla i mysli.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                {...getAnimationConfigWithDelay(shouldReduceMotion, index * 0.1)}
                className="bg-white/70 backdrop-blur-[16px] border border-[#de397e]/20 rounded-3xl p-8 transition-all duration-300 hover:border-[#de397e]/40 hover:shadow-md cursor-pointer"
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="flex items-start gap-5 mb-5">
                  <motion.div
                    className="flex-shrink-0 p-4 bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] rounded-2xl"
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Icon className="w-7 h-7 text-[#de397e]" />
                  </motion.div>
                  <div className="flex-1">
                    <h3
                      className="text-[#2c2c2c] mb-2"
                      style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                    >
                      {service.name}
                    </h3>
                  </div>
                </div>
                <p className="text-[#666666] mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#de397e]/10">
                  <span className="text-[#666666]" style={{ fontSize: '1.05rem', fontWeight: 500 }}>{service.duration}</span>
                  <span className="text-[#c4a75f]" style={{ fontSize: '1.15rem', fontWeight: 600 }}>{service.price}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}