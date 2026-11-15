'use client'

import type { MouseEvent } from 'react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

interface DesktopNavProps {
  activeSection: string
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}

export default function DesktopNav({ activeSection, onNavigate }: DesktopNavProps) {
  return (
    <div className='hidden items-center gap-[clamp(1rem,2vw,2rem)] lg:flex'>
      {siteContent.navigation.items.map((item) => {
        const isActive = activeSection === item.href.replace('#', '')

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(event) => onNavigate(event, item.href)}
            aria-current={isActive ? 'location' : undefined}
            className={`link-wipe hover:text-ink cursor-pointer py-2 text-[0.9375rem] transition-colors duration-300 ease-out ${isActive ? 'text-ink' : 'text-body'}`}
          >
            {applyCzechNbsp(item.label)}
          </a>
        )
      })}
    </div>
  )
}
