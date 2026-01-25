'use client'

import { motion } from 'framer-motion';
import { ImageWithFallback } from '@/src/components/shared/ImageWithFallback';
import { useReducedMotion, getAnimationConfig, getAnimationConfigWithDelay } from '@/src/hooks/useReducedMotion';
import profileImage from "@/src/assets/56d78eee09ad0ac51d12b673a62b4fb6b3748b3e.png";

export default function About() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section id="about" className="py-32 px-6 md:px-16 bg-linear-to-b f from-white via-[#fef8fb] to-white overflow-hidden">
      <div className="container mx-auto max-w-5xl">  {/* Vráceno na max-w-5xl, bez extra paddingu */}
        <motion.h2
          {...getAnimationConfig(shouldReduceMotion)}
          className="text-center text-[#de397e] mb-20 tracking-wider"
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Něco málo o mně
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">  {/* Symetrický grid zpět, gap 12/16 */}
          {/* Text content - Left */}
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.2)}
            className="order-2 lg:order-1 space-y-8"
          >
            <div>
              <h3
                className="text-[#2c2c2c] mb-2"
                style={{ fontSize: '2rem', fontWeight: 500 }}
              >
                Mgr. Radka Šebestová
              </h3>
              <p 
                className="text-[#de397e] mb-6"
                style={{ fontSize: '1.1rem', fontWeight: 400 }}
              >
                Terapeutka a masérka
              </p>
            </div>

            <div className="space-y-5">
              <p className="text-[#666666] leading-loose">
                Jsem mladá žena s chutí žít život naplno. Cítím, že mým posláním je <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>vykouzlit
                druhým na tváři úsměv</span>.
              </p>
              <p className="text-[#666666] leading-loose">
                Ráda bych, abyste se mnou <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>zapomněli na každodenní starosti</span> a užili si chvíli
                určenou jen a jen vám.
              </p>
              <p className="text-[#666666] leading-loose">
                Ke každému člověku se snažím přistupovat jako k <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>jedinečné bytosti</span>.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#de397e]/20">
              <div className="text-center">
                <div className="text-[#de397e] mb-2" style={{ fontFamily: 'Dancing Script', fontSize: '3rem' }}>
                  16+
                </div>
                <div className="text-[#666666] text-sm leading-relaxed">
                  let zkušeností
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#de397e] mb-2" style={{ fontFamily: 'Dancing Script', fontSize: '3rem' }}>
                  1 500+
                </div>
                <div className="text-[#666666] text-sm leading-relaxed">
                  spokojených klientů
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#de397e] mb-2" style={{ fontFamily: 'Dancing Script', fontSize: '3rem' }}>
                  12
                </div>
                <div className="text-[#666666] text-sm leading-relaxed">
                  druhů masáží
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h4
                className="text-[#de397e] mb-5"
                style={{ fontFamily: 'Dancing Script', fontSize: '1.6rem' }}
              >
                Těším se na Vaši návštěvu
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]">
                    <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>Magisterské studium ošetřovatelství</span> na VŠZaSP sv. Alžbety v Bratislavě
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]">Specializace v oboru <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>geriatrie</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]">
                    <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>Dlouholetý masér</span> pro zdravotnictví a terapeut
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]">
                    Zkušenosti se zařízeními <span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>sociální a zdravotní péče</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]"><span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>Učitelka</span> zdravotnických předmětů</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 bg-[#c4a75f] rounded-full" />
                  <span className="text-[#666666]"><span className="text-[#2c2c2c]" style={{ fontWeight: 600 }}>Lektor</span> v sociální sféře</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Image - Right - Same animation from top */}
          <motion.div
            {...getAnimationConfigWithDelay(shouldReduceMotion, 0.2)}
            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-md">
              {/* Image with linear gradient soft edges */}
              <div
                className="relative w-full"
                style={{
                  maskImage: 'linear-gradient(transparent, black 2% 98%, transparent), linear-gradient(90deg, transparent, black 3% 97%, transparent)',
                  WebkitMaskImage: 'linear-gradient(transparent, black 2% 98%, transparent), linear-gradient(90deg, transparent, black 3% 97%, transparent)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              >
                <ImageWithFallback
                  src={profileImage}
                  alt="Mgr. Radka Šebestová"
                  className="w-full aspect-3/4 object-cover object-top"
                  style={{
                    filter: 'brightness(1.04) contrast(0.96) saturate(1.08)'
                  }}
                />
              </div>
              
              {/* Subtle glow around image */}
              <div 
                className="absolute inset-0 -z-10"
                style={{
                  background: 'radial-gradient(ellipse 80% 85% at 50% 40%, rgba(222,57,126,0.08) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  transform: 'scale(1.1)'
                }}
              />
              
              {/* Decorative elements */}
              <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#de397e]/6 rounded-full blur-3xl -z-20" />
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#c4a75f]/5 rounded-full blur-2xl -z-20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}