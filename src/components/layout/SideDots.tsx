'use client'

import { useState, useEffect } from 'react';

import { NAVIGATION_SECTIONS, SCROLL_THRESHOLD } from '@/src/constants/navigation';
import { scrollToSection, getActiveSection, isScrolledPastThreshold } from '@/src/utils/navigation';

export default function SideDots() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show side dots when navbar hides
      setIsVisible(isScrolledPastThreshold(SCROLL_THRESHOLD));

      // Update active section
      const sectionIds = NAVIGATION_SECTIONS.map(s => s.id);
      setActiveSection(getActiveSection(sectionIds));
    };

    // Run on mount and scroll
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Also run after a short delay on mount to catch initial state
    const timeout = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-0 right-3 z-30 pointer-events-none">
      <div className="relative mx-auto px-6 md:px-16 max-w-7xl h-0">
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{ 
            pointerEvents: isVisible ? 'auto' : 'none',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out'
          }}
        >
          <div className="flex flex-col gap-4">
            {NAVIGATION_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative cursor-pointer"
                aria-label={`Přejít na sekci ${section.label}`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-[#de397e] scale-125 shadow-lg shadow-[#de397e]/50'
                      : 'bg-white/60 border-2 border-[#de397e]/40 backdrop-blur-[8px] hover:bg-[#de397e]/60 hover:border-[#de397e] hover:scale-110'
                  }`}
                />
                {/* Beautiful script text label with shadow */}
                <span 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#de397e] text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium"
                  style={{ 
                    fontFamily: 'Dancing Script, cursive',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 10px rgba(222, 57, 126, 0.3)'
                  }}
                >
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}