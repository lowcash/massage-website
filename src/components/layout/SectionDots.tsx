'use client'

import { useEffect, useState } from 'react'

import { siteContent } from '@/lib/content'
import { cn, scrollToSection } from '@/lib/utils'

import { resolveActiveSection } from '@/src/lib/navigation-core-adapter'

const SHOW_AFTER_SCROLL = 360

const sections = [
  { id: 'hero', label: siteContent.navigation.homeAriaLabel },
  ...siteContent.navigation.items.map((item) => ({ id: item.href.replace('#', ''), label: item.label })),
]

/**
 * Side position indicator for wide screens. It duplicates the navbar, so it is hidden from assistive
 * tech and keyboard focus; sighted mouse users get a "where am I" cue without a visible scrollbar.
 */
export default function SectionDots() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frameId: number | null = null

    const sync = () => {
      frameId = null
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL)
      setActiveSection(resolveActiveSection(sections.map((section) => section.id)) ?? 'hero')
    }

    const schedule = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(sync)
      }
    }

    sync()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <nav
      aria-hidden='true'
      className={cn(
        'fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 xl:flex',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            type='button'
            tabIndex={-1}
            onClick={() => scrollToSection(section.id)}
            className='group relative flex h-4 w-4 cursor-pointer items-center justify-center'
          >
            <span
              className={cn(
                'rounded-full transition-all duration-300',
                isActive
                  ? 'bg-brand h-3 w-3 shadow-[0_0_0_4px_rgba(162,77,63,0.16)]'
                  : 'bg-ink/25 group-hover:bg-brand/70 h-2 w-2',
              )}
            />
            <span className='bg-ink/90 pointer-events-none absolute right-7 rounded-full px-3 py-1 text-xs tracking-wide whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              {section.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
