'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Jak dlouho trvá masáž?',
    answer:
      'Délka masáže závisí na typu služby. <strong>Klasická masáž trvá 60-90 minut</strong>, <strong>sportovní masáž 45-60 minut</strong> a <strong>relaxační masáž 90 minut</strong>. Přesnou dobu naleznete u každé služby v ceníku.',
  },
  {
    question: 'Co si mám vzít s sebou?',
    answer:
      '<strong>Není potřeba nic speciálního.</strong> Ručníky, oleje a vše potřebné zajistím. Doporučuji přijít v pohodlném oblečení a vzít si případně čistý převlek na cestu domů.',
  },
  {
    question: 'Jak probíhá rezervace?',
    answer:
      'Rezervaci můžete provést <strong>telefonicky na čísle (+420) 605 579 643</strong>, pomocí WhatsApp nebo SMS. <strong>Termín je platný až po mém osobním potvrzení.</strong>',
  },
  {
    question: 'Mohu zrušit nebo přesunout termín?',
    answer:
      'Ano, termín lze zrušit nebo přesunout <strong>nejpozději 24 hodin před plánovanou masáží</strong>. Prosím, informujte mě včas telefonicky nebo zprávou.',
  },
  {
    question: 'Jsou masáže vhodné pro těhotné ženy?',
    answer:
      'Nabízím speciální masáže pro těhotné ženy <strong>od 2. trimestru</strong>. Před rezervací je důležité informovat mě o těhotenství, abych mohla připravit vhodnou techniku a polohování.',
  },
  {
    question: 'Jaká je platba za služby?',
    answer:
      'Platba probíhá <strong>v hotovosti nebo převodem na účet</strong> po absolvování masáže. Ceny služeb najdete v sekci služeb nebo mi neváhejte zavolat.',
  },
  {
    question: 'Kde se masáže konají?',
    answer:
      'Masáže probíhají <strong>v mém klidném a soukromém prostoru v Hodoníně</strong>. Přesnou adresu sdělím při potvrzení rezervace. Zajišťuji diskrétní a příjemné prostředí pro maximální relaxaci.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id='faq' className='py-32 px-6 md:px-16 bg-gradient-to-b from-white via-[#fef8fb] to-white'>
      <div className='container mx-auto max-w-4xl'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className='text-center text-[#de397e] mb-6 tracking-wider'
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Často kladené otázky
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1.2, ease: 'easeInOut' }}
          className='text-center text-[#666666] mb-16 max-w-2xl mx-auto leading-loose'
        >
          Vše, co potřebujete vědět před návštěvou
        </motion.p>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
              className={`bg-white/70 backdrop-blur-[16px] border rounded-3xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'border-[#de397e]/40' : 'border-white/50 hover:border-[#de397e]/25'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full px-8 py-6 flex items-center justify-between text-left transition-all duration-300 hover:bg-white cursor-pointer'
              >
                <span className='text-[#2c2c2c] pr-4' style={{ fontWeight: 500 }}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className='flex-shrink-0'
                >
                  <ChevronDown className='w-5 h-5 text-[#de397e]' />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <div className='px-8 pb-6 text-[#666666] leading-loose' dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
