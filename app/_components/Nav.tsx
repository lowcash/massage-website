'use client'

import React from 'react'

import { NAME, SECTIONS } from '@/config'

export default function Nav() {
  const [activeSection, setActiveSection] = React.useState('home')

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-opacity-15 backdrop-blur-md'>
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
                  fontWeight: 500,
                  color: activeSection === section.id ? 'rgb(223 180 202)' : 'white',
                  textShadow: `0 1px 4px var(--pink)`,
                }}
              >
                {section.label}

                {/* Underline element for active and hover states */}
                <span
                  className='absolute left-0 right-0 bottom-0 h-0.5 transition-all duration-300 ease-in-out transform origin-left'
                  style={{
                    backgroundColor: 'var(--pink)',
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
    </>
  )
}
