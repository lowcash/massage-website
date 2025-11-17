'use client'

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 md:px-16 bg-gradient-to-b from-white to-[#fef8fb]">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-center text-[#de397e] mb-6 tracking-wider"
          style={{ fontFamily: 'Dancing Script', fontSize: '2.2rem' }}
        >
          Kde mě najdete?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8, ease: 'easeInOut' }}
          className="text-center text-[#666666] mb-20 max-w-2xl mx-auto leading-loose"
        >
          Ozvěte se mi pro rezervaci nebo s jakýmkoliv dotazem
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="space-y-8"
          >
            {/* Phone Card */}
            <a
              href="tel:+420605579643"
              className="block bg-white/70 backdrop-blur-[16px] border border-[#de397e]/20 rounded-2xl p-8 transition-all duration-300 hover:border-[#de397e]/40 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#de397e]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#2c2c2c] mb-2"
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Telefon
                  </h3>
                  <p className="text-[#de397e] transition-colors">
                    (+420) 605 579 643
                  </p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:sebestovar@seznam.cz"
              className="block bg-white/70 backdrop-blur-[16px] border border-[#de397e]/20 rounded-2xl p-8 transition-all duration-300 hover:border-[#de397e]/40 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#de397e]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#2c2c2c] mb-2"
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Email
                  </h3>
                  <p className="text-[#de397e] break-all transition-colors">
                    sebestovar@seznam.cz
                  </p>
                </div>
              </div>
            </a>

            {/* Address Card */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=49.0661739,17.1213106"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/70 backdrop-blur-[16px] border border-[#de397e]/20 rounded-2xl p-8 transition-all duration-300 hover:border-[#de397e]/40 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#de397e]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#2c2c2c] mb-2"
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Adresa
                  </h3>
                  <p className="text-[#666666]">
                    Národní třída 383/15, Hodonín, 695 01
                  </p>
                </div>
              </div>
            </a>

            {/* Hours Card */}
            <div className="bg-white/70 backdrop-blur-[16px] border border-[#de397e]/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#de397e]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#2c2c2c] mb-4"
                    style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}
                  >
                    Otevírací doba
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Po - Pá:</span>
                      <span className="text-[#2c2c2c]">15:00 - 21:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">So:</span>
                      <span className="text-[#2c2c2c]">Zavřeno</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Ne:</span>
                      <span className="text-[#2c2c2c]">Zavřeno</span>
                    </div>
                  </div>
                  <p className="text-[#666666] text-sm mt-4 italic">
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
            className="h-full min-h-[600px] lg:min-h-0"
          >
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/50 rounded-3xl overflow-hidden h-full shadow-[0_8px_24px_rgba(222,57,126,0.08)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2633.3!2d17.1213!3d48.8483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b6df8e1f8c1b1%3A0x1!2sN%C3%A1rodn%C3%AD%20t%C5%99%C3%ADda%20383%2F15%2C%20695%2001%20Hodon%C3%ADn!5e0!3m2!1sen!2scz!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '600px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pohlazení po těle a duši - Mapa"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}