'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { siteContent } from '@/lib/content'
import { scrollToSection, updateLocationHash } from '@/lib/utils'

import { isProgrammaticScrollActive, resolveActiveSection } from '@/src/lib/navigation-core-adapter'

/** After a nav click, keep the clicked section highlighted while the smooth scroll runs. */
const NAVIGATION_SYNC_LOCK_MS = 1400

interface UseActiveSectionOptions {
  /**
   * While true (mobile drawer locks the body with position:fixed), scroll metrics collapse and the
   * resolver would falsely pick the last section — keep the highlight frozen until unlock.
   */
  isScrollFrozenRef: RefObject<boolean>
}

/**
 * Hash sync, active section highlight, header "scrolled" state and scroll progress bar.
 * Returns `progressRef` — attach it to the progress bar element (scaled via `style.scale`).
 */
export function useActiveSection({ isScrollFrozenRef }: UseActiveSectionOptions) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigationLockRef = useRef<{ sectionId: string; expiresAt: number } | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  /** Highlight `sectionId` immediately and ignore observer updates for NAVIGATION_SYNC_LOCK_MS. */
  const lockSection = useCallback((sectionId: string) => {
    navigationLockRef.current = {
      sectionId,
      expiresAt: Date.now() + NAVIGATION_SYNC_LOCK_MS,
    }
    setActiveSection(sectionId)
  }, [])

  /** Drop the lock (e.g. the scroll target did not exist). */
  const releaseSectionLock = useCallback(() => {
    navigationLockRef.current = null
  }, [])

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
    const sectionIds = ['hero', ...siteContent.navigation.items.map((item) => item.href.replace('#', ''))]
    let frameId: number | null = null
    let hashSyncTimerId: number | null = null
    let pendingHashSectionId: string | null = null

    const flushLocationHash = () => {
      hashSyncTimerId = null
      if (pendingHashSectionId === null || isProgrammaticScrollActive()) {
        return
      }

      updateLocationHash(pendingHashSectionId)
      pendingHashSectionId = null
    }

    // Defer hash writes until scrolling stops. Writing #section during momentum (esp. iOS)
    // can trigger fragment re-alignment and makes the fixed header look like it jumps up.
    const scheduleLocationHashSync = (sectionId: string) => {
      pendingHashSectionId = sectionId

      if (hashSyncTimerId !== null) {
        window.clearTimeout(hashSyncTimerId)
      }

      hashSyncTimerId = window.setTimeout(flushLocationHash, 120)
    }

    const updateActiveSection = () => {
      const lock = navigationLockRef.current
      if (lock && Date.now() <= lock.expiresAt) {
        setActiveSection(lock.sectionId)
        return
      }

      if (lock) {
        navigationLockRef.current = null
      }

      // While the drawer locks body with position:fixed, scroll metrics collapse and the
      // resolver falsely picks the last section — keep the highlight frozen until unlock.
      if (isScrollFrozenRef.current) {
        return
      }

      const currentSection = resolveActiveSection(sectionIds) ?? 'hero'

      setActiveSection(currentSection)
      if (!isProgrammaticScrollActive()) {
        scheduleLocationHashSync(currentSection)
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

    const handleScrollEnd = () => {
      flushLocationHash()
    }

    runNavigationSync()
    window.addEventListener('scroll', scheduleNavigationSync, { passive: true })
    window.addEventListener('scrollend', handleScrollEnd)
    window.addEventListener('resize', scheduleNavigationSync)

    return () => {
      window.removeEventListener('scroll', scheduleNavigationSync)
      window.removeEventListener('scrollend', handleScrollEnd)
      window.removeEventListener('resize', scheduleNavigationSync)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }

      if (hashSyncTimerId !== null) {
        window.clearTimeout(hashSyncTimerId)
      }
    }
  }, [isScrollFrozenRef])

  return { activeSection, isScrolled, progressRef, lockSection, releaseSectionLock }
}
