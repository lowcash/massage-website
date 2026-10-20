'use client'

import { useEffect, useRef, useState } from 'react'

import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, scrollToSection, updateLocationHash } from '@/lib/utils'

import { isProgrammaticScrollActive, resolveActiveSection } from '@/src/lib/navigation-core-adapter'

export default function Navigation() {
  const NAVIGATION_SYNC_LOCK_MS = 1400

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigationLockRef = useRef<{ sectionId: string; expiresAt: number } | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

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
    let frameId: number | null = null

    const updateActiveSection = () => {
      const lock = navigationLockRef.current
      if (lock && Date.now() <= lock.expiresAt) {
        setActiveSection(lock.sectionId)
        return
      }

      if (lock) {
        navigationLockRef.current = null
      }

      const currentSection = resolveActiveSection(sectionIds) ?? 'hero'

      setActiveSection(currentSection)
      if (!isProgrammaticScrollActive()) {
        updateLocationHash(currentSection)
      }
    }

    const updateScrollProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

      if (progressRef.current) {
        progressRef.current.style.scale = `${progress} 1`
      }
    }

    const runNavigationSync = () => {
      frameId = null
      setIsScrolled(window.scrollY > 18)
      updateScrollProgress()
      updateActiveSection()
    }

    const scheduleNavigationSync = () => {
      if (frameId !== null) {
        return
      }

      frameId = window.requestAnimationFrame(runNavigationSync)
    }

    runNavigationSync()
    window.addEventListener('scroll', scheduleNavigationSync, { passive: true })
    window.addEventListener('resize', scheduleNavigationSync)

    return () => {
      window.removeEventListener('scroll', scheduleNavigationSync)
      window.removeEventListener('resize', scheduleNavigationSync)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 border-b px-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 md:px-8 ${
          isScrolled
            ? 'bg-surface/95 border-line/70 shadow-[0_8px_28px_rgba(60,35,28,0.07)] backdrop-blur-lg'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav className='mx-auto flex w-full max-w-6xl items-center justify-between py-5'>
          <button
            type='button'
            onClick={() => handleNavigationClick('#hero')}
            className={
              isScrolled
                ? 'font-dancing text-ink text-[1.4rem] leading-none whitespace-nowrap transition-colors duration-300 ease-out min-[360px]:text-[1.7rem] sm:text-[2rem] lg:text-[2.1rem]'
                : 'font-dancing text-[1.4rem] leading-none whitespace-nowrap text-white transition-colors duration-300 ease-out min-[360px]:text-[1.7rem] sm:text-[2rem] lg:text-[2.1rem]'
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
                    ? `hover:text-brand-hover cursor-pointer text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 ease-out ${activeSection === item.href.replace('#', '') ? 'text-brand-hover' : 'text-muted-ink'}`
                    : `cursor-pointer text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 ease-out hover:text-white ${activeSection === item.href.replace('#', '') ? 'text-[#ffe4de]' : 'text-white'}`
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
                ? 'border-line text-muted-ink flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white/70 lg:hidden'
                : 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/10 text-white lg:hidden'
            }
            aria-label={siteContent.navigation.openMenuAriaLabel}
          >
            <Menu className='h-5 w-5' />
          </button>
        </nav>

        <div
          aria-hidden='true'
          className={`absolute inset-x-0 bottom-[-1px] h-0.5 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        >
          <div ref={progressRef} className='bg-brand h-full w-full origin-left' />
        </div>
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
        className={`border-line bg-surface/92 fixed top-0 right-0 bottom-0 z-50 flex h-dvh w-[92%] max-w-sm flex-col border-l backdrop-blur-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Mirrors the exact navbar layout: px-5 py-5 */}
        <div className='flex shrink-0 items-center justify-between px-5 py-5'>
          <button
            type='button'
            onClick={() => handleNavigationClick('#hero')}
            className='font-dancing text-ink text-left text-[1.4rem] leading-none whitespace-nowrap transition-opacity duration-300 ease-out hover:opacity-85 min-[360px]:text-[1.9rem]'
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </button>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(false)}
            className='border-line text-muted-ink flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white/70'
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
                className={`font-display flex cursor-pointer items-center justify-between rounded-2xl px-5 py-3.5 text-left text-[1.7rem] leading-none transition-colors duration-300 ease-out ${activeSection === item.href.replace('#', '') ? 'bg-paper text-brand shadow-[0_6px_20px_rgba(70,40,32,0.08)]' : 'text-ink hover:bg-white/70'}`}
              >
                {applyCzechNbsp(item.label)}
                {activeSection === item.href.replace('#', '') ? (
                  <span aria-hidden='true' className='bg-brand h-2 w-2 rounded-full' />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className='border-line mt-auto border-t px-4 pt-5 pb-4 sm:px-6 sm:pb-6'>
          <div className='text-body grid gap-2.5 text-sm sm:gap-3'>
            <a
              href={`tel:+${siteContent.brand.phoneDigits}`}
              className='border-line hover:border-line hover:bg-paper flex items-start gap-3 rounded-2xl border bg-white px-4 py-2.5 transition-colors duration-300 ease-out sm:py-3'
            >
              <Phone className='text-brand mt-0.5 h-4 w-4' />
              <span className='leading-snug'>{siteContent.brand.phone}</span>
            </a>

            <a
              href={`mailto:${siteContent.brand.email}`}
              className='border-line hover:border-line hover:bg-paper flex items-start gap-3 rounded-2xl border bg-white px-4 py-2.5 transition-colors duration-300 ease-out sm:py-3'
            >
              <Mail className='text-brand mt-0.5 h-4 w-4' />
              <span className='leading-snug'>{siteContent.brand.email}</span>
            </a>

            <a
              href={siteContent.brand.mapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className='border-line hover:border-line hover:bg-paper flex items-start gap-3 rounded-2xl border bg-white px-4 py-2.5 transition-colors duration-300 ease-out sm:py-3'
            >
              <MapPin className='text-brand mt-0.5 h-4 w-4' />
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
