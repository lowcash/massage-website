'use client'

import { useState, useEffect } from 'react'
import { X, Menu, Phone, Mail, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'



export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Služby', href: '#services' },
    { label: 'O mně', href: '#about' },
    { label: 'Recenze', href: '#testimonials' },
    { label: 'Kalendář', href: '#booking' },
    { label: 'Kontakt', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop & Mobile Navigation - Hidden on scroll */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{
          y: isScrolled ? -120 : 0,
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-[24px] border-b border-white/30 shadow-sm'
      >
        <div className='container mx-auto px-6 md:px-16 py-5 max-w-7xl'>
          <div className='flex items-center justify-between'>
            {/* Logo - Simple elegant text */}
            <button
              onClick={() => scrollToSection('#hero')}
              className='transition-all duration-300 hover:opacity-80 cursor-pointer'
            >
              <span className='text-[#de397e]' style={{ fontFamily: 'Dancing Script', fontSize: '1.75rem', lineHeight: '1' }}>
                Pohlazení po těle a duši
              </span>
            </button>

            {/* Desktop Menu - Dancing Script with subtle color change - desktop only (1024+) */}
            <div className='hidden lg:flex items-center gap-10'>
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className='text-[#888888] transition-all duration-300 hover:text-[#b08888] cursor-pointer'
                  style={{ fontFamily: 'Dancing Script', fontSize: '1.15rem' }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile + Tablet Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className='lg:hidden p-3 sm:p-4 rounded-xl bg-white/60 backdrop-blur-[16px] border border-white/50 hover:bg-white/80 transition-all cursor-pointer'
              aria-label='Otevřít menu'
            >
              <Menu className='w-5 h-5 text-[#de397e]' />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Button When Scrolled - Floating - mobile + tablet */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className='lg:hidden fixed top-4 right-4 z-40 p-3 sm:p-4 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-white cursor-pointer'
            aria-label='Otevřít menu'
          >
            <Menu className='w-5 h-5 text-[#de397e]' />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Slide-in Menu with Glass Effect */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50'
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 bottom-0 w-[340px] bg-white/90 backdrop-blur-[32px] border-l border-white/40 shadow-2xl z-50'
            >
              {/* Logo in mobile menu - clickable to scroll to hero */}
              <div className='px-8 pt-8 pb-4 border-b border-[#de397e]/10'>
                <button
                  onClick={() => {
                    scrollToSection('#hero')
                    setIsMobileMenuOpen(false)
                  }}
                  className='text-left w-full cursor-pointer hover:opacity-80 transition-opacity'
                >
                  <span className='text-[#de397e]' style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem' }}>
                    Pohlazení po těle a duši
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <div className='absolute top-6 right-6'>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='p-2 rounded-full bg-[#fef8fb] hover:bg-[#de397e]/10 transition-colors cursor-pointer'
                  aria-label='Zavřít menu'
                >
                  <X className='w-6 h-6 text-[#de397e]' />
                </button>
              </div>

              {/* Menu Items - Dancing Script like desktop - fade all together */}
              <nav className='px-8 py-6 space-y-2'>
                {menuItems.map((item) => (
                  <div key={item.href} className='relative'>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.15,
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                      onClick={() => scrollToSection(item.href)}
                      className='text-[#888888] hover:text-[#de397e] transition-all duration-300 py-3 px-6 rounded-2xl hover:bg-[#fef8fb] text-left w-full cursor-pointer'
                      style={{ fontFamily: 'Dancing Script', fontSize: '1.15rem' }}
                    >
                      {item.label}
                    </motion.button>
                  </div>
                ))}
              </nav>

              {/* Contact Info in Mobile Menu */}
              <div className='absolute bottom-8 left-0 right-0 px-8'>
                <div className='bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] p-5 rounded-2xl border border-[#de397e]/20'>
                  <p className='text-[#de397e] mb-3' style={{ fontFamily: 'Dancing Script', fontSize: '1.3rem' }}>
                    Kontakt
                  </p>
                  <div className='space-y-2'>
                    <a
                      href="tel:+420605579643"
                      className='flex items-center gap-3 px-4 py-3 bg-white/40 hover:bg-white/70 text-[#2c2c2c] rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm'
                    >
                      <Phone className='w-5 h-5 flex-shrink-0 text-[#de397e]' />
                      <span className='text-sm overflow-hidden text-ellipsis whitespace-nowrap'>(+420) 605 579 643</span>
                    </a>
                    <a
                      href={`mailto:sebestovar@seznam.cz`}
                      className='flex items-center gap-3 px-4 py-3 bg-white/40 hover:bg-white/70 text-[#2c2c2c] rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm'
                    >
                      <Mail className='w-5 h-5 flex-shrink-0 text-[#de397e]' />
                      <span className='text-sm overflow-hidden text-ellipsis whitespace-nowrap'>sebestovar@seznam.cz</span>
                    </a>
                    <a
                      href='https://www.google.com/maps/search/?api=1&query=49.0661739,17.1213106'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-3 px-4 py-3 bg-white/40 hover:bg-white/70 text-[#2c2c2c] rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm'
                    >
                      <MapPin className='w-5 h-5 flex-shrink-0 text-[#de397e]' />
                      <span className='text-sm overflow-hidden text-ellipsis whitespace-nowrap'>
                        Národní třída 383/15, Hodonín
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
