'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import {
  PHONE,
  EMAIL,
  ADDRESS,
  OPENING_HOURS_SATURDAY,
  OPENING_HOURS_SUNDAY,
  OPENING_HOURS_WORKDAYS,
} from '@/const'

export default function Contact() {
  return (
    <section id='kontakt' className='py-32 px-6 md:px-16 bg-gradient-to-b from-white to-[#fef8fb]'>
      <div className='container mx-auto max-w-5xl'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#de397e] mb-6 tracking-wider'
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Kde mě najdete?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8, ease: 'easeInOut' }}
          className='text-center text-[#666666] mb-20 max-w-2xl mx-auto leading-loose'
        >
          Ozvěte se mi pro rezervaci nebo s jakýmkoliv dotazem
        </motion.p>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className='space-y-6'
          >
            {/* Phone Card */}
            <a
              href={`tel:${PHONE}`}
              className='block bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl p-6 transition-all duration-300 hover:border-[#de397e]/25 cursor-pointer'
            >
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0 p-3 bg-[#fef8fb] rounded-xl'>
                  <Phone className='w-6 h-6 text-[#de397e]' />
                </div>
                <div className='flex-1'>
                  <h3
                    className='text-[#2c2c2c] mb-1'
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Telefon
                  </h3>
                  <p className='text-[#de397e]'>{PHONE}</p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${EMAIL}`}
              className='block bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl p-6 transition-all duration-300 hover:border-[#de397e]/25 cursor-pointer'
            >
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0 p-3 bg-[#fef8fb] rounded-xl'>
                  <Mail className='w-6 h-6 text-[#de397e]' />
                </div>
                <div className='flex-1'>
                  <h3
                    className='text-[#2c2c2c] mb-1'
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Email
                  </h3>
                  <p className='text-[#de397e] break-all'>{EMAIL}</p>
                </div>
              </div>
            </a>

            {/* Address Card - Clickable to Google Maps */}
            <a
              href='https://www.google.com/maps/search/?api=1&query=48.8508,17.1244'
              target='_blank'
              rel='noopener noreferrer'
              className='block bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl p-6 transition-all duration-300 hover:border-[#de397e]/25 cursor-pointer'
            >
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0 p-3 bg-[#fef8fb] rounded-xl'>
                  <MapPin className='w-6 h-6 text-[#de397e]' />
                </div>
                <div className='flex-1'>
                  <h3
                    className='text-[#2c2c2c] mb-1'
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Adresa
                  </h3>
                  <p className='text-[#666666]'>Národní třída 383/15, Hodonín, 695 01</p>
                </div>
              </div>
            </a>

            {/* Hours Card */}
            <div className='bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl p-6'>
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 p-3 bg-[#fef8fb] rounded-xl'>
                  <Clock className='w-6 h-6 text-[#de397e]' />
                </div>
                <div className='flex-1'>
                  <h3
                    className='text-[#2c2c2c] mb-4'
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Otevírací doba
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-[#666666]'>Po - Pá:</span>
                      <span className='text-[#2c2c2c]'>{OPENING_HOURS_WORKDAYS}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-[#666666]'>So:</span>
                      <span className='text-[#2c2c2c]'>{OPENING_HOURS_SATURDAY}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-[#666666]'>Ne:</span>
                      <span className='text-[#2c2c2c]'>{OPENING_HOURS_SUNDAY}</span>
                    </div>
                  </div>
                  <p className='text-[#666666] text-sm mt-4 italic'>
                    Termíny jsou flexibilní a přizpůsobím se vašim potřebám
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
            className='h-full min-h-[600px] lg:min-h-0'
          >
            <div className='bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl overflow-hidden h-full shadow-[0_8px_24px_rgba(222,57,126,0.08)]'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3885048659795!2d17.12444661318573!3d48.850801601119265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47132e50d40a6673%3A0x15ea7a6c27e74db8!2zTsOhcm9kbsOtIHTFmS4gMzgzLzE1LCA2OTUgMDEgSG9kb27DrW4gMQ!5e0!3m2!1scs!2scz!4v1747158426680!5m2!1scs!2scz'
                width='100%'
                height='100%'
                style={{ border: 0, minHeight: '600px' }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Pohlazení po těle a duší - Mapa'
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
