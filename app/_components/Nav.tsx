'use client'

import React from 'react'

import { NAME, SECTIONS } from '@/config'

export default function Nav() {
  const [activeSection, setActiveSection] = React.useState('home')
  const [scrollOpacity, setScrollOpacity] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 200;  // Maximální výška scrollu pro efekt  
      const currentScroll = window.scrollY;

      // Výpočet opacity between 0 a 1  
      const opacity = Math.min(currentScroll / maxScroll, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 px-4 py-3' style={{
      backgroundColor: `rgba(255, 255, 255, ${scrollOpacity})`,
      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, ${scrollOpacity * 0.1}),   
      0 2px 4px -1px rgba(0, 0, 0, ${scrollOpacity * 0.06})`
    }}>
      <div className='mx-auto flex items-center justify-between'>
        {/* Logo */}
        <div
          className='text-3xl font-bold text-[var(--pink)]'
          style={{
            fontFamily: "'Dancing Script'",
          }}
        >
          {NAME}
        </div>

        {/* Navigation Links */}
        <div className='hidden md:flex space-x-6'>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                  px-2 py-1 text-base uppercase tracking-wider transition-all duration-300 ease-in-out
                  relative cursor-pointer
                `}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                color: scrollOpacity > 0.5 ? 'var(--light-pink)' : 'white',
                textShadow: `0 1px 1px var(--pink)`,
              }}
            >
              {section.label}

              {/* Underline element for active and hover states */}
              <span
                className='absolute left-0 right-0 bottom-0 h-0.5 transition-all duration-300 ease-in-out transform origin-left'
                style={{
                  backgroundColor: 'var(--light-pink)',
                  transform: activeSection === section.id ? 'scaleX(1)' : 'scaleX(0)',
                }}
              ></span>

              {/* Hover effect that only appears on non-active items */}
              {activeSection !== section.id && (
                <span
                  className='absolute left-0 right-0 bottom-0 h-0.5 opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out transform origin-right'
                  style={{
                    backgroundColor: 'var(--pink)',
                  }}
                ></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
