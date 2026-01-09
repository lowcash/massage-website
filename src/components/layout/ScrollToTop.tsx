'use client'

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="relative mx-auto px-6 md:px-16 max-w-7xl h-0">
        <AnimatePresence>
          {isVisible && (
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              onClick={scrollToTop}
              className="pointer-events-auto absolute bottom-8 right-4 sm:bottom-10 p-3 sm:p-4 bg-white/60 backdrop-blur-[16px] border border-white/40 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-white/80 cursor-pointer"
              style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-6 h-6 text-[#de397e]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}