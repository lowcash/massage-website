'use client'

import { useState, useEffect } from 'react'
import { X, Menu } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Check which section is currently in view
      const sections = ['sluzby', 'kalendar', 'o-mne', 'kontakt']
      const scrollPosition = window.scrollY + 100

      let currentSection = 'hero'

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element && scrollPosition >= element.offsetTop) {
          currentSection = section
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Prevent scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 py-2 shadow-sm backdrop-blur-sm' : 'bg-transparent py-6'}`}
      >
        <div className='container mx-auto flex items-center justify-between px-4'>
          <h1
            className='font-dancing text-bc6290 cursor-pointer text-2xl md:text-3xl'
            onClick={() => scrollToSection('hero')}
          >
            Pohlazení po těle a duši
          </h1>

          <nav className='hidden md:block'>
            <ul className='flex gap-10'>
              <li>
                <button
                  onClick={() => scrollToSection('sluzby')}
                  className={`text-xs font-light tracking-widest uppercase ${activeSection === 'sluzby' ? 'nav-link-active' : 'nav-link'}`}
                >
                  Služby
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('kalendar')}
                  className={`text-xs font-light tracking-widest uppercase ${activeSection === 'kalendar' ? 'nav-link-active' : 'nav-link'}`}
                >
                  Kalendář
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('o-mne')}
                  className={`text-xs font-light tracking-widest uppercase ${activeSection === 'o-mne' ? 'nav-link-active' : 'nav-link'}`}
                >
                  O mně
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('kontakt')}
                  className={`text-xs font-light tracking-widest uppercase ${activeSection === 'kontakt' ? 'nav-link-active' : 'nav-link'}`}
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </nav>

          <button
            className='relative z-50 h-6 w-6 focus:outline-none md:hidden'
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          >
            <Menu
              className={`menu-icon absolute inset-0 h-6 w-6 ${isMobileMenuOpen ? 'open' : ''}`}
              style={{ color: isMobileMenuOpen ? 'transparent' : '#bc6290' }}
            />
            <X
              className={`close-icon absolute inset-0 h-6 w-6 ${isMobileMenuOpen ? 'open' : ''}`}
              style={{ color: '#ffffff' }}
            />
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu overlay with fade transition */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <nav className='text-center'>
          <ul className='space-y-6'>
            <li>
              <button onClick={() => scrollToSection('hero')} className='mobile-menu-link'>
                Domů
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('sluzby')} className='mobile-menu-link'>
                Služby
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('kalendar')} className='mobile-menu-link'>
                Kalendář
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('o-mne')} className='mobile-menu-link'>
                O mně
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('kontakt')} className='mobile-menu-link'>
                Kontakt
              </button>
            </li>
          </ul>
        </nav>
        <button onClick={toggleMobileMenu} className='absolute top-4 right-4 z-50 text-white' aria-label='Zavřít menu'>
          <X className='h-6 w-6' />
        </button>
      </div>
    </>
  )
}
