import { siteContent } from '@/lib/content'

import GalleryInteractive from '@/src/components/features/GalleryInteractive'
import { SectionIntro } from '@/src/components/shared/SectionIntro'

export default function Gallery() {
  return (
    <section id='studio' className='bg-[#f1e3df] px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-14'>
        <SectionIntro id='studio-heading' title={siteContent.studio.heading} subtitle={siteContent.studio.subtitle} />
        <GalleryInteractive />
      </div>
    </section>
  )
}
