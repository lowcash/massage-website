'use client'

import { useState, useEffect } from 'react'
import { X, Menu } from 'lucide-react'

import { NAME, SECTION, SECTIONS_NAV } from '@/const'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(SECTION.HERO.id)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Check which section is currently in view
      const sections = ['sluzby', 'kalendar', 'o-mne', 'kontakt']
      const scrollPosition = window.scrollY + 100

      let currentSection = SECTION.HERO.id

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
      document.body.style.overflow = ''
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
            className='font-dancing text-bc6290 cursor-pointer pl-1 text-2xl font-medium md:text-3xl'
            onClick={() => scrollToSection(SECTION.HERO.id)}
            style={{ textShadow: '0px 2px 8px rgba(0,0,0,0.2)' }}
          >
            {NAME}
          </h1>

          <nav className='hidden md:block'>
            <ul className='flex gap-10'>
              {SECTIONS_NAV.map((x, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(x.id)}
                    className={`text-xs font-normal tracking-widest uppercase ${activeSection === x.id ? 'nav-link-active' : 'nav-link'}`}
                    style={{ textShadow: '0px 2px 8px rgba(0,0,0,0.2)' }}
                  >
                    {x.text}
                  </button>
                </li>
              ))}
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
            {[SECTION.HERO, ...SECTIONS_NAV].map((x, idx) => (
              <li key={idx}>
                <button onClick={() => scrollToSection(x.id)} className='mobile-menu-link'>
                  {x.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={toggleMobileMenu} className='absolute top-5 right-5 z-50 text-white' aria-label='Zavřít menu'>
          <X className='h-6 w-6' />
        </button>
      </div>
    </>
  )
}
