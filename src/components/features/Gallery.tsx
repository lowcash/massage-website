import { siteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

import GalleryInteractive from '@/src/components/features/GalleryInteractive'
import { CONTENT_SHELL } from '@/src/components/layout/content-shell'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function Gallery() {
  return (
    <section id='studio' className='bg-band py-[var(--spacing-s6)]'>
      <div className={cn(CONTENT_SHELL, 'flex flex-col gap-[var(--spacing-s4)]')}>
        <SectionIntro id='studio-heading' title={siteContent.studio.heading} subtitle={siteContent.studio.subtitle} />
        <GalleryInteractive />
      </div>
    </section>
  )
}
