'use client'

import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Menu } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp, scrollToSection } from '@/lib/utils'

import DesktopNav from '@/src/components/layout/DesktopNav'
import MobileDrawer from '@/src/components/layout/MobileDrawer'
import { useActiveSection } from '@/src/hooks/useActiveSection'
import { useScrollLock } from '@/src/hooks/useScrollLock'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pendingMenuScrollRef = useRef<string | null>(null)
  const isMenuScrollLockedRef = useRef(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const { activeSection, isScrolled, progressRef, lockSection, releaseSectionLock } = useActiveSection({
    isScrollFrozenRef: isMenuScrollLockedRef,
  })

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  // iOS Safari ignores overflow:hidden on body during touch scroll; the hook locks with position:fixed.
  // Keep this call ABOVE the effect below: on close its cleanup restores scrollY first, then the effect's
  // cleanup runs the pending section scroll.
  useScrollLock(isMobileMenuOpen, 'fixed')

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    isMenuScrollLockedRef.current = true

    return () => {
      const pendingSectionId = pendingMenuScrollRef.current
      pendingMenuScrollRef.current = null
      isMenuScrollLockedRef.current = false

      if (!pendingSectionId) {
        return
      }

      const didScroll = scrollToSection(pendingSectionId)
      if (!didScroll) {
        releaseSectionLock()
      }
    }
  }, [isMobileMenuOpen, releaseSectionLock])

  const handleNavigationClick = (href: string) => {
    const sectionId = href.replace('#', '')

    lockSection(sectionId)

    // Body is position:fixed while the drawer is open. Scrolling now uses wrong rects, and the
    // unlock cleanup would also restore the pre-open scrollY and wipe the navigation target.
    if (isMobileMenuOpen) {
      pendingMenuScrollRef.current = sectionId
      setIsMobileMenuOpen(false)
      return
    }

    const didScroll = scrollToSection(sectionId)
    if (!didScroll) {
      releaseSectionLock()
    }
  }

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Let the browser handle "open in new tab/window" gestures.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    handleNavigationClick(href)
  }

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 border-b border-[color-mix(in_oklab,var(--color-line)_70%,transparent)] bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-[clamp(1.25rem,0.6rem+3vw,3.5rem)] pt-[env(safe-area-inset-top,0px)] [backdrop-filter:blur(16px)_saturate(1.2)] transition-shadow duration-300 ${
          isScrolled ? 'shadow-[0_8px_28px_var(--color-overlay-nav)]' : ''
        }`}
      >
        <nav className='mx-auto flex h-[var(--navigation-bar-height)] w-full max-w-[76rem] items-center justify-between gap-4'>
          <a
            href='#hero'
            onClick={(event) => handleAnchorClick(event, '#hero')}
            className='flex min-w-0 flex-col leading-[1.05] [view-transition-name:logo]'
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            <b className='text-ink font-display text-[clamp(1.05rem,0.9rem+0.6vw,1.3rem)] leading-none font-[450] [font-variation-settings:"SOFT"_100,"opsz"_48]'>
              {applyCzechNbsp(siteContent.brand.name)}
            </b>
            <span
              aria-hidden='true'
              className='text-muted-ink mt-1.5 text-[0.6875rem] leading-none font-semibold tracking-[0.16em] uppercase'
            >
              {applyCzechNbsp(siteContent.brand.subtitle)}
            </span>
          </a>

          <DesktopNav activeSection={activeSection} onNavigate={handleAnchorClick} />

          <div className='flex items-center gap-3'>
            <a
              href='#booking'
              onClick={(event) => handleAnchorClick(event, '#booking')}
              className='bg-brand text-on-brand hover:bg-brand-hover btn-lift hidden min-h-11 items-center rounded-full px-5 text-xs leading-none font-semibold tracking-[0.14em] uppercase transition-[background-color,box-shadow,transform] duration-260 ease-(--ease-soft) hover:-translate-y-px active:scale-[0.98] min-[30rem]:inline-flex'
            >
              {siteContent.navigation.bookCta}
            </a>

            <button
              ref={menuButtonRef}
              type='button'
              onClick={() => setIsMobileMenuOpen(true)}
              className='border-ink/28 bg-paper text-ink flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border lg:hidden'
              aria-label={siteContent.navigation.openMenuAriaLabel}
              aria-haspopup='dialog'
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className='h-5 w-5' />
            </button>
          </div>
        </nav>

        <div
          aria-hidden='true'
          className={`absolute inset-x-0 bottom-[-1px] h-0.5 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        >
          <div ref={progressRef} className='bg-brand h-full w-full origin-left' />
        </div>
      </header>

      <MobileDrawer
        open={isMobileMenuOpen}
        activeSection={activeSection}
        onClose={closeMenu}
        onNavigate={handleAnchorClick}
        returnFocusRef={menuButtonRef}
      />
    </>
  )
}
