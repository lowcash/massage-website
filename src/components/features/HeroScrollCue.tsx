import { ChevronDown } from 'lucide-react'

import SectionAnchor from '@/src/components/shared/SectionAnchor'

interface HeroScrollCueProps {
  href: string
  ariaLabel: string
}

/** In-flow cue inside the hero — absolute (not fixed) so it never fights iOS scroll or the WhatsApp FAB. */
export default function HeroScrollCue({ href, ariaLabel }: HeroScrollCueProps) {
  const sectionId = href.replace(/^#/, '')

  return (
    <SectionAnchor
      sectionId={sectionId}
      className='absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/75 transition-colors duration-300 ease-out hover:text-white motion-safe:animate-bounce [@media(max-height:600px)]:hidden'
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      aria-label={ariaLabel}
    >
      <ChevronDown className='h-8 w-8' />
    </SectionAnchor>
  )
}
