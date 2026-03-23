'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const handleNavigationClick = (href: string) => {
    const sectionId = href.replace('#', '')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const sectionIds = ['hero', ...siteContent.navigation.items.map((item) => item.href.replace('#', ''))]

    const updateActiveSection = () => {
      const offsetY = window.scrollY + 140
      let currentSection = 'hero'

      sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) {
          return
        }

        if (offsetY >= section.offsetTop) {
          currentSection = id
        }
      })

      setActiveSection(currentSection)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18)
      updateActiveSection()
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return (
    <>
      <header
        className={
          isScrolled
            ? 'fixed top-0 right-0 left-0 z-50 bg-[#f6edeb]/88 transition-colors duration-300'
            : 'fixed top-0 right-0 left-0 z-50 bg-transparent transition-colors duration-300'
        }
      >
        <nav className='mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8'>
          <button
            type='button'
            onClick={() => handleNavigationClick('#hero')}
            className={
              isScrolled
                ? 'font-dancing text-3xl leading-none text-[#5f3b36] transition'
                : 'font-dancing text-3xl leading-none text-white transition'
            }
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </button>

          <div className='hidden items-center gap-5 md:flex lg:gap-8'>
            {siteContent.navigation.items.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleNavigationClick(item.href)}
                aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                className={
                  isScrolled
                    ? `cursor-pointer text-xs tracking-[0.22em] uppercase transition hover:text-[#b96657] ${activeSection === item.href.replace('#', '') ? 'text-[#b96657]' : 'text-[#6e4d48]'}`
                    : `cursor-pointer text-xs tracking-[0.22em] uppercase transition hover:text-[#ffe4de] ${activeSection === item.href.replace('#', '') ? 'text-[#ffe4de]' : 'text-white'}`
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(true)}
            className={
              isScrolled
                ? 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d4b2aa] bg-white/70 text-[#6e4d48] md:hidden'
                : 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/10 text-white md:hidden'
            }
            aria-label={siteContent.navigation.openMenuAriaLabel}
          >
            <Menu className='h-5 w-5' />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 z-50 cursor-pointer bg-black/55 backdrop-blur-sm'
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className='fixed top-0 right-0 bottom-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-[#e4cfc9] bg-[#f8ede9]/90 px-6 py-6 backdrop-blur-2xl'
            >
              <div className='mb-10 flex items-center'>
                <span className='font-dancing text-3xl text-[#5f3b36]'>
                  {applyCzechNbsp(siteContent.brand.name)}
                </span>

                <button
                  type='button'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='fixed top-5 right-5 z-60 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d5b6ae] bg-white/70 text-[#6e4d48]'
                  aria-label={siteContent.navigation.closeMenuAriaLabel}
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='flex flex-col gap-3'>
                {siteContent.navigation.items.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleNavigationClick(item.href)}
                    aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                    className={`cursor-pointer rounded-2xl border bg-white/70 px-5 py-4 text-left text-sm tracking-[0.2em] uppercase transition hover:bg-white ${activeSection === item.href.replace('#', '') ? 'border-[#d8b1a8] bg-[#fff8f6] text-[#be675a]' : 'border-[#e5d0cb] text-[#5f3b36]'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className='mt-auto grid gap-3 text-sm text-[#6b5551]'>
                <a
                  href={`tel:+${siteContent.brand.phoneDigits}`}
                  className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-3 transition hover:border-[#d8b6af] hover:bg-[#fff8f6]'
                >
                  <Phone className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
                  <span className='leading-snug'>{siteContent.brand.phone}</span>
                </a>

                <a
                  href={`mailto:${siteContent.brand.email}`}
                  className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-3 transition hover:border-[#d8b6af] hover:bg-[#fff8f6]'
                >
                  <Mail className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
                  <span className='leading-snug'>{siteContent.brand.email}</span>
                </a>

                <a
                  href={siteContent.brand.mapsLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-3 transition hover:border-[#d8b6af] hover:bg-[#fff8f6]'
                >
                  <MapPin className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
                  <span className='leading-snug'>
                    {siteContent.brand.addressLine1}
                    <br />
                    {siteContent.brand.addressLine2}
                  </span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}