'use client'

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '@/src/components/shared/ImageWithFallback';
import heroImage1 from "@/src/assets/4e82636e00d6ed1714427e23df88aa2114a00d8b.png";
import heroImage2 from "@/src/assets/529868a68c329f2cd79b11f95989565412c07b61.png";
import heroImage3 from "@/src/assets/2d115fb3cb1c74e407bde90bbf7d740b4c3604f2.png";
import heroImage4 from "@/src/assets/830e380376f6a1fee2b223e47cd9f988168500d6.png";
import heroImage5 from "@/src/assets/5f3a5cfa64b8db7422ef3fc40749c1e76bb1a86e.png";
import heroImage6 from "@/src/assets/669702bfa59a3e8017fcb4cb9cbf4fe49cedcddf.png";

const carouselImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5, heroImage6];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Ignore touch on button to allow proper click
    if (target.closest('button')) {
      return;
    }
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const diff = touchStart - touchEnd;
    
    // Only trigger if horizontal swipe is significant
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        // Swipe left - next image
        goToNext();
      } else {
        // Swipe right - previous image
        goToPrevious();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollToBooking = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Images with Crossfade */}
      <div className="absolute inset-0">
        {carouselImages.map((image, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1.05 : 1,
            }}
            transition={{ 
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: { duration: 12, ease: 'linear' }
            }}
            className="absolute inset-0"
            style={{ 
              transform: `translateY(${scrollY * 0.5}px)`,
              zIndex: index === currentIndex ? 1 : 0
            }}
          >
            <ImageWithFallback
              src={image}
              alt={`Masážní služby ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
            {/* Dark overlay with blur for text readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          </motion.div>
        ))}
      </div>

      {/* Content - Always visible with high z-index */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 md:px-16">
        <h1
          className="text-white mb-6"
          style={{ 
            fontFamily: 'Dancing Script', 
            fontSize: '3.5rem', 
            lineHeight: '1.2',
            letterSpacing: '0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.7)'
          }}
        >
          Pohlazení po těle a duši
        </h1>
        <p
          className="text-white text-xl mb-10 max-w-2xl"
          style={{ 
            textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.8)',
            lineHeight: '1.8',
            letterSpacing: '0.02em'
          }}
        >
          Dotek, který uleví - péče, která obnoví.
        </p>
        {/* CTA Button - NO FADE */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToBooking}
          className="group px-8 py-3 bg-white/75 backdrop-blur-[24px] border-2 border-white/70 rounded-full transition-all duration-300 hover:bg-white hover:border-white hover:shadow-xl cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        >
          <span 
            className="text-[#de397e] group-hover:text-[#c4a75f] transition-colors duration-300"
            style={{ fontFamily: 'Dancing Script', fontSize: '1.4rem' }}
          >
            Vyberte si masáž
          </span>
        </motion.button>
      </div>

      {/* Navigation Arrows - desktop only, respektují max-width kontejneru navbaru */}
      <div className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 z-20">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="relative">
            <button
              onClick={goToPrevious}
              className="absolute left-0 p-3 bg-white/60 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/80 cursor-pointer"
              aria-label="Předchozí obrázek"
            >
              <ChevronLeft className="w-6 h-6 text-[#de397e]" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 p-3 bg-white/60 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/80 cursor-pointer"
              aria-label="Další obrázek"
            >
              <ChevronRight className="w-6 h-6 text-[#de397e]" />
            </button>
          </div>
        </div>
      </div>

      {/* Dot Indicators - Always visible */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full drop-shadow-lg cursor-pointer ${
              index === currentIndex
                ? 'bg-white w-8 h-3'
                : 'bg-white/50 w-3 h-3 hover:bg-white/75'
            }`}
            aria-label={`Přejít na obrázek ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}