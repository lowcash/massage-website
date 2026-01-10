'use client'

import { motion } from 'framer-motion';
import { useBooking } from '@/src/contexts/BookingContext';
import { useReducedMotion, getAnimationConfig, getAnimationConfigWithDelay } from '@/src/hooks/useReducedMotion';
import Image from 'next/image';
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
  Scissors,
  Gift
} from 'lucide-react';
import giftVoucherImage from '@/src/assets/poukazy.jpg';

const services = [
  {
    id: 1,
    name: 'Ošetření spoušťových bodů',
    description: 'Terapeutická technika zaměřená na uvolnění svalových uzlů a zmírnění bolesti prostřednictvím tlaku na specifické body v těle.',
    duration: '50 min',
    price: 'od 750,-',
    icon: Target,
  },
  {
    id: 2,
    name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
    description: 'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a pohybový aparát.',
    duration: '50 min',
    price: 'od 750,-',
    icon: AlignCenter,
  },
  {
    id: 3,
    name: 'Thajská masáž nohou',
    description: 'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a protahování pro uvolnění napětí a podporu celkového zdraví.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Footprints,
  },
  {
    id: 4,
    name: 'Medová detoxikační masáž',
    description: 'Relaxační technika, při které se pomocí teplého medu a speciálních hmatů odstraňují toxiny z těla a zlepšuje se prokrvení pokožky.',
    duration: '60 min',
    price: 'od 800,-',
    icon: Droplet,
  },
  {
    id: 5,
    name: 'Deep tissue massage',
    description: 'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a pojivových tkáních pomocí pomalých, intenzivních tahů.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Zap,
  },
  {
    id: 6,
    name: 'Protimigrénová masáž',
    description: 'Cílená relaxační technika zaměřená na uvolnění napětí v oblasti hlavy, krku a ramen s cílem zmírnit nebo předejít migrénám.',
    duration: '50 min',
    price: 'od 700,-',
    icon: Brain,
  },
  {
    id: 7,
    name: 'Spinální masáž',
    description: 'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a zlepšuje funkci nervového systému.',
    duration: '60 min',
    price: 'od 800,-',
    icon: Activity,
  },
  {
    id: 8,
    name: 'Baby masáže (3x)',
    description: 'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a posilují vazbu mezi rodičem a dítětem.',
    duration: '45 min',
    price: '950,-',
    icon: Baby,
  },
  {
    id: 9,
    name: 'Reflexní masáž zad a šíje',
    description: 'Cílená masážní technika, která stimuluje nervové reflexní zóny k uvolnění napětí, zmírnění bolesti a podpoře regenerace v oblasti zad a šíje.',
    duration: '30 min',
    price: '500,-',
    icon: HandMetal,
  },
  {
    id: 10,
    name: 'Těhotenská masáž',
    description: 'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a zmírnit bolesti spojené s těhotenstvím.',
    duration: '60 min',
    price: 'od 850,-',
    icon: Heart,
  },
  {
    id: 11,
    name: 'Kineziotaping',
    description: 'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s cílem podpořit hojení, zmírnit bolest a zlepšit funkci svalů a kloubů.',
    duration: '',
    price: '100,- (+2,- cm)',
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
    <section id="services" className="py-32 px-6 md:px-16 bg-linear-to-b from-white via-[#fef8fb] to-white">
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
          Nabízím širokou škálu masáží a terapií přizpůsobených vašim individuálním potřebám pro dosažení harmonie těla i mysli.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                {...getAnimationConfigWithDelay(shouldReduceMotion, (index + 1) * 0.1)}
                className="bg-white/70 backdrop-blur-lg border border-[#de397e]/20 rounded-3xl p-8 transition-all duration-300 hover:border-[#de397e]/40 hover:shadow-md cursor-pointer"
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="flex items-start gap-5 mb-5">
                  <motion.div
                    className="shrink-0 p-4 bg-linear-to-br from-[#fef8fb] to-[#fff5f9] rounded-2xl"
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

          {/* Gift Voucher Card - Featured */}
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, (services.length + 1) * 0.1)}
            className="lg:col-span-2 bg-linear-to-br from-[#c4a75f] to-[#a08945] border-2 border-[#c4a75f] rounded-3xl overflow-hidden transition-all duration-300 relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 z-0" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-0">
              {/* Image section */}
              <div className="md:w-2/5 relative h-64 md:h-auto min-h-[280px]">
                <Image
                  src={giftVoucherImage}
                  alt="Dárkové poukazy"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Content section */}
              <div className="flex-1 p-6 md:p-8 md:pr-20 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-lg">
                    <Gift className="w-7 h-7 text-[#c4a75f]" />
                  </div>
                  <h3
                    className="text-white"
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.8rem' }}
                  >
                    Dárkové poukazy
                  </h3>
                </div>
                
                <p className="text-white/90 mb-5 leading-relaxed" style={{ hyphens: 'auto', wordSpacing: '0.1em' }} lang="cs">
                  Darujte svým blízkým chvíle plné relaxace a pohody.
                  <br />
                  Ideální dárek pro každou příležitost - narozeniny, Vánoce nebo jen tak pro radost.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    ✓ Libovolná hodnota
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    ✓ Flexibilní použití
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    ✓ Okamžitá objednávka
                  </span>
                </div>
                
                <div>
                  <motion.a
                    href="https://wa.me/420605579643?text=Dobrý%20den,%20mám%20zájem%20o%20dárkový%20poukaz."
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-[#c4a75f] rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span style={{ fontFamily: 'Dancing Script', fontSize: '1.3rem' }}>
                      Objednat dárkový poukaz
                    </span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}