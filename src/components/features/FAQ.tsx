'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion, getAnimationConfig, getAnimationConfigWithDelay } from '@/src/hooks/useReducedMotion';

const faqs = [
  {
    question: 'Jak dlouho trvá masáž?',
    answer: 'Délka masáže závisí na typu služby. <strong>Klasická terapie trvá 50-60 minut</strong>. Přesnou dobu naleznete u každé služby v ceníku.',
  },
  {
    question: 'Co si mám vzít s sebou?',
    answer: '<strong>Není potřeba nic speciálního.</strong> Ručníky, oleje a vše potřebné zajistím. Doporučuji přijít v pohodlném oblečení a vzít si případně čistý převlek na cestu domů.',
  },
  {
    question: 'Jak probíhá rezervace?',
    answer: 'Rezervaci můžete provést <strong>telefonicky na čísle (+420) 605 579 643</strong>, pomocí WhatsApp nebo SMS. <strong>Termín je platný až po mém osobním potvrzení.</strong>',
  },
  {
    question: 'Mohu zrušit nebo přesunout termín?',
    answer: 'Ano, termín lze zrušit nebo přesunout <strong>nejpozději 24 hodin před plánovanou masáží</strong>. Prosím, informujte mě včas telefonicky nebo zprávou.',
  },
  {
    question: 'Jaká je platba za služby?',
    answer: 'Platba probíhá <strong>v hotovosti nebo převodem na účet</strong> po absolvování masáže. Ceny služeb najdete v sekci služeb nebo mi neváhejte zavolat.',
  },
  {
    question: 'Kde se masáže konají?',
    answer: 'Masáže probíhají <strong>v mém klidném a soukromém prostoru v Hodoníně</strong>. Přesnou adresu sdělím při potvrzení rezervace. Zajišťuji diskrétní a příjemné prostředí pro maximální relaxaci.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 px-6 md:px-16 bg-linear-to-b from-white via-[#fef8fb] to-white">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          {...getAnimationConfig(shouldReduceMotion)}
          className="text-center text-[#de397e] mb-6 tracking-wider"
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Často kladené otázky
        </motion.h2>

        <motion.p
          {...getAnimationConfigWithDelay(shouldReduceMotion, 0.2)}
          className="text-center text-[#666666] mb-16 max-w-2xl mx-auto leading-loose"
        >
          Vše, co potřebujete vědět před návštěvou
        </motion.p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              {...getAnimationConfigWithDelay(shouldReduceMotion, index * 0.1)}
              className={`bg-white/70 backdrop-blur-lg border rounded-3xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'border-[#de397e]/40 shadow-md' 
                  : 'border-[#de397e]/20 hover:border-[#de397e]/35 hover:shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left transition-all duration-300 hover:bg-white cursor-pointer"
              >
                <span className="text-[#2c2c2c] pr-4" style={{ fontWeight: 500 }}>{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-[#de397e]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-8 pb-6 text-[#666666] leading-loose"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}