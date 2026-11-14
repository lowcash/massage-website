'use client'

import type { MouseEvent } from 'react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

interface DesktopNavProps {
  activeSection: string
  isScrolled: boolean
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}

export default function DesktopNav({ activeSection, isScrolled, onNavigate }: DesktopNavProps) {
  return (
    <div className='hidden items-center gap-5 lg:flex lg:gap-7'>
      {siteContent.navigation.items.map((item) => {
        const isActive = activeSection === item.href.replace('#', '')

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(event) => onNavigate(event, item.href)}
            aria-current={isActive ? 'location' : undefined}
            className={
              isScrolled
                ? `hover:text-brand-hover cursor-pointer text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 ease-out ${isActive ? 'text-brand-hover' : 'text-muted-ink'}`
                : `cursor-pointer text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 ease-out hover:text-white ${isActive ? 'text-nav-hero-active' : 'text-white'}`
            }
          >
            {applyCzechNbsp(item.label)}
          </a>
        )
      })}
    </div>
  )
}
