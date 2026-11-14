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
        className={`fixed top-0 right-0 left-0 z-50 border-b px-5 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 md:px-8 ${
          isScrolled
            ? 'bg-surface/95 border-line/70 shadow-[0_8px_28px_var(--color-overlay-nav)] backdrop-blur-lg'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav className='mx-auto flex w-full max-w-6xl items-center justify-between py-5'>
          <a
            href='#hero'
            onClick={(event) => handleAnchorClick(event, '#hero')}
            className={
              isScrolled
                ? 'font-dancing text-ink text-[1.4rem] leading-none whitespace-nowrap transition-colors duration-300 ease-out min-[360px]:text-[1.7rem] sm:text-[2rem] lg:text-[2.1rem]'
                : 'font-dancing text-[1.4rem] leading-none whitespace-nowrap text-white transition-colors duration-300 ease-out min-[360px]:text-[1.7rem] sm:text-[2rem] lg:text-[2.1rem]'
            }
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </a>

          <DesktopNav activeSection={activeSection} isScrolled={isScrolled} onNavigate={handleAnchorClick} />

          <button
            ref={menuButtonRef}
            type='button'
            onClick={() => setIsMobileMenuOpen(true)}
            className={
              isScrolled
                ? 'border-line text-muted-ink flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white/70 lg:hidden'
                : 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/10 text-white lg:hidden'
            }
            aria-label={siteContent.navigation.openMenuAriaLabel}
            aria-haspopup='dialog'
            aria-expanded={isMobileMenuOpen}
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
