'use client'

import { useState, useEffect } from 'react';
import { Gift, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import giftVoucherImage from '@/src/assets/830e380376f6a1fee2b223e47cd9f988168500d6.png';

export default function GiftVoucherButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed container with max-width and padding */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="relative mx-auto px-6 md:px-16 max-w-7xl h-0">
          {/* Floating Button */}
          <AnimatePresence>
            {isVisible && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 100 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowModal(true)}
                className="pointer-events-auto absolute right-2 top-32 group cursor-pointer"
                aria-label="Dárkové poukazy"
              >
                {/* Main button */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#c4a75f] to-[#a08945] text-white rounded-2xl p-4 shadow-2xl border-2 border-white/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_30px_rgba(196,167,95,0.4)]">
                    <Gift className="w-6 h-6" />
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute inset-0 rounded-2xl bg-[#c4a75f]/30 animate-ping" />
                  
                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    <div className="bg-white/95 backdrop-blur-sm text-[#2c2c2c] px-4 py-2 rounded-xl shadow-lg border border-[#c4a75f]/20">
                      <span style={{ fontFamily: 'Dancing Script', fontSize: '1.1rem' }}>
                        Dárkové poukazy
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[90vh] md:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - moved outside content */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-4 -right-4 p-3 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 cursor-pointer z-20 shadow-xl border-2 border-gray-100"
                aria-label="Zavřít"
              >
                <X className="w-6 h-6 text-[#2c2c2c]" />
              </button>

              {/* Modal content - flexbox layout */}
              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* Left side - Image */}
                <div className="md:w-1/2 relative h-32 md:h-auto min-h-[120px] md:min-h-[400px] flex-shrink-0">
                  <Image
                    src={giftVoucherImage}
                    alt="Dárkové poukazy"
                    fill
                    className="object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                    priority
                  />
                </div>

                {/* Right side - Content */}
                <div className="md:w-1/2 flex flex-col">
                  <div className="p-4 md:p-8 flex flex-col justify-between h-full">
                    {/* Header - kompaktní na mobilu */}
                    <div className="text-center mb-3 md:mb-4">
                      <div className="inline-block p-2 md:p-3 bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] rounded-2xl mb-2 md:mb-3">
                        <Gift className="w-8 h-8 md:w-10 md:h-10 text-[#c4a75f]" />
                      </div>
                      <h3
                        className="text-[#de397e] mb-1.5 md:mb-2"
                        style={{ fontFamily: 'Dancing Script', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}
                      >
                        Dárkové poukazy
                      </h3>
                      <p className="text-[#666666] leading-relaxed text-sm md:text-base px-10" style={{ wordSpacing: '0.1em' }} lang="cs">
                        Darujte svým blízkým chvíle plné relaxace a pohody.
                      </p>
                    </div>

                    {/* Benefits - kompaktní na mobilu */}
                    <div className="space-y-1.5 md:space-y-2.5 mb-3 md:mb-5 flex-grow">
                      <div className="flex items-center gap-2 md:gap-2.5 p-2 md:p-2.5 bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] rounded-xl">
                        <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-[#c4a75f] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-[#2c2c2c] font-medium text-xs md:text-sm" style={{ hyphens: 'auto' }} lang="cs">Flexibilní použití na kteroukoli službu</p>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-2.5 p-2 md:p-2.5 bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] rounded-xl">
                        <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-[#c4a75f] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-[#2c2c2c] font-medium text-xs md:text-sm" style={{ hyphens: 'auto' }} lang="cs">Libovolná hodnota podle vašich představ</p>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-2.5 p-2 md:p-2.5 bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] rounded-xl">
                        <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-[#c4a75f] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-[#2c2c2c] font-medium text-xs md:text-sm" style={{ hyphens: 'auto' }} lang="cs">Okamžitá objednávka přes WhatsApp</p>
                      </div>
                    </div>

                    {/* CTA Buttons - kompaktní na mobilu */}
                    <div className="flex flex-col gap-2 md:gap-3">
                      <motion.a
                        href="https://wa.me/420605579643?text=Dobrý%20den,%20mám%20zájem%20o%20dárkový%20poukaz."
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-[#de397e] text-white rounded-2xl transition-all duration-300 hover:bg-[#c4a75f] hover:shadow-xl cursor-pointer"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span style={{ fontFamily: 'Dancing Script', fontSize: 'clamp(1rem, 3vw, 1.15rem)' }}>
                          Napište mi na WhatsApp
                        </span>
                      </motion.a>
                      
                      <motion.a
                        href="tel:+420605579643"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-white border-2 border-[#de397e] text-[#de397e] rounded-2xl transition-all duration-300 hover:bg-[#fef8fb] cursor-pointer"
                      >
                        <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        <span style={{ fontFamily: 'Dancing Script', fontSize: 'clamp(1rem, 3vw, 1.15rem)' }}>
                          Zavolejte mi
                        </span>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
