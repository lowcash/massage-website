'use client'

import { useEffect, useRef, useState } from 'react'

import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, getNavigationOffset, scrollToSection } from '@/lib/utils'

export default function Navigation() {
  const NAVIGATION_SYNC_LOCK_MS = 1400

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigationLockRef = useRef<{ sectionId: string; expiresAt: number } | null>(null)

  const handleNavigationClick = (href: string) => {
    const sectionId = href.replace('#', '')

    navigationLockRef.current = {
      sectionId,
      expiresAt: Date.now() + NAVIGATION_SYNC_LOCK_MS,
    }

    const didScroll = scrollToSection(sectionId)
    if (!didScroll) {
      navigationLockRef.current = null
      setIsMobileMenuOpen(false)
      return
    }

    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const applyHashScroll = () => {
      const hashId = window.location.hash.replace('#', '')
      if (!hashId) {
        return
      }

      const didScroll = scrollToSection(hashId, { behavior: 'auto', updateHash: false })
      if (!didScroll) {
        return
      }

      setActiveSection(hashId)
    }

    const timerId = window.setTimeout(applyHashScroll, 0)
    window.addEventListener('hashchange', applyHashScroll)

    return () => {
      window.clearTimeout(timerId)
      window.removeEventListener('hashchange', applyHashScroll)
    }
  }, [])

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
      const lock = navigationLockRef.current
      if (lock && Date.now() <= lock.expiresAt) {
        setActiveSection(lock.sectionId)
        return
      }

      if (lock) {
        navigationLockRef.current = null
      }

      const offsetY = window.scrollY + getNavigationOffset()
      let currentSection = 'hero'

      for (let index = sectionIds.length - 1; index >= 0; index -= 1) {
        const id = sectionIds[index]
        const section = document.getElementById(id)
        if (!section) {
          continue
        }

        const sectionTop = section.getBoundingClientRect().top + window.scrollY

        if (offsetY >= sectionTop) {
          currentSection = id
          break
        }
      }

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
                ? 'font-dancing text-[1.9rem] leading-none text-[#5f3b36] transition-colors duration-300 ease-out sm:text-3xl'
                : 'font-dancing text-[1.9rem] leading-none text-white transition-colors duration-300 ease-out sm:text-3xl'
            }
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </button>

          <div className='hidden items-center gap-5 lg:flex lg:gap-7'>
            {siteContent.navigation.items.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleNavigationClick(item.href)}
                aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                className={
                  isScrolled
                    ? `cursor-pointer text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:text-[#b96657] ${activeSection === item.href.replace('#', '') ? 'text-[#b96657]' : 'text-[#6e4d48]'}`
                    : `cursor-pointer text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:text-[#ffe4de] ${activeSection === item.href.replace('#', '') ? 'text-[#ffe4de]' : 'text-white'}`
                }
              >
                {applyCzechNbsp(item.label)}
              </button>
            ))}
          </div>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(true)}
            className={
              isScrolled
                ? 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d4b2aa] bg-white/70 text-[#6e4d48] lg:hidden'
                : 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/10 text-white lg:hidden'
            }
            aria-label={siteContent.navigation.openMenuAriaLabel}
          >
            <Menu className='h-5 w-5' />
          </button>
        </nav>
      </header>

      {/* Mobile drawer — CSS transitions, no framer-motion */}
      <div
        aria-hidden={!isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-50 cursor-pointer bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        role='dialog'
        aria-label={siteContent.navigation.openMenuAriaLabel}
        aria-modal='true'
        inert={!isMobileMenuOpen || undefined}
        className={`fixed top-0 right-0 bottom-0 z-50 flex h-dvh w-[92%] max-w-sm flex-col border-l border-[#e4cfc9] bg-[#f8ede9]/92 backdrop-blur-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Mirrors the exact navbar layout: px-5 py-5 */}
        <div className='flex shrink-0 items-center justify-between px-5 py-5'>
          <button
            type='button'
            onClick={() => handleNavigationClick('#hero')}
            className='font-dancing text-left text-[1.9rem] leading-none text-[#5f3b36] transition-opacity duration-300 ease-out hover:opacity-85 sm:text-3xl'
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </button>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(false)}
            className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d5b6ae] bg-white/70 text-[#6e4d48]'
            aria-label={siteContent.navigation.closeMenuAriaLabel}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6'>
          <div className='flex flex-col gap-2.5 sm:gap-3'>
            {siteContent.navigation.items.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleNavigationClick(item.href)}
                aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                className={`cursor-pointer rounded-2xl border bg-white/70 px-4 py-3 text-left text-[13px] tracking-[0.16em] uppercase transition-colors duration-300 ease-out hover:bg-white sm:px-5 sm:py-4 sm:text-sm sm:tracking-[0.2em] ${activeSection === item.href.replace('#', '') ? 'border-[#d8b1a8] bg-[#fff8f6] text-[#be675a]' : 'border-[#e5d0cb] text-[#5f3b36]'}`}
              >
                {applyCzechNbsp(item.label)}
              </button>
            ))}
          </div>
        </div>

        <div className='mt-auto border-t border-[#e8d5d0] px-4 pt-5 pb-4 sm:px-6 sm:pb-6'>
          <div className='grid gap-2.5 text-sm text-[#6b5551] sm:gap-3'>
            <a
              href={`tel:+${siteContent.brand.phoneDigits}`}
              className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-2.5 transition-colors duration-300 ease-out hover:border-[#d8b6af] hover:bg-[#fff8f6] sm:py-3'
            >
              <Phone className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
              <span className='leading-snug'>{siteContent.brand.phone}</span>
            </a>

            <a
              href={`mailto:${siteContent.brand.email}`}
              className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-2.5 transition-colors duration-300 ease-out hover:border-[#d8b6af] hover:bg-[#fff8f6] sm:py-3'
            >
              <Mail className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
              <span className='leading-snug'>{siteContent.brand.email}</span>
            </a>

            <a
              href={siteContent.brand.mapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-start gap-3 rounded-2xl border border-[#e3ccc7] bg-white px-4 py-2.5 transition-colors duration-300 ease-out hover:border-[#d8b6af] hover:bg-[#fff8f6] sm:py-3'
            >
              <MapPin className='mt-0.5 h-4 w-4 text-[#ca6f61]' />
              <span className='leading-snug'>
                {applyCzechNbsp(siteContent.brand.addressLine1)}
                <br />
                {applyCzechNbsp(siteContent.brand.addressLine2)}
              </span>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
