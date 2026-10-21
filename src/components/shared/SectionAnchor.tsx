'use client'

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'

import { scrollToSection } from '@/lib/utils'

type SectionAnchorProps = {
  sectionId: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'onClick'>

/** In-page section link that uses the relaxed programmatic scroll instead of native hash jumping. */
export default function SectionAnchor({ sectionId, children, ...props }: SectionAnchorProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <a {...props} href={`#${sectionId}`} onClick={onClick}>
      {children}
    </a>
  )
}
