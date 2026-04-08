import { applyCzechNbsp } from '@/lib/utils'

interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  description?: string
  light?: boolean
}

export function SectionIntro({ id, title, subtitle, description, light = false }: SectionIntroProps) {
  return (
    <div className='mx-auto flex max-w-3xl flex-col items-center gap-3 text-center'>
      <h2
        id={id}
        className={
          light ? 'font-dancing text-4xl text-white md:text-5xl' : 'font-dancing text-4xl text-[#2f2523] md:text-5xl'
        }
      >
        {applyCzechNbsp(title)}
      </h2>
      <p
        className={
          light
            ? 'text-sm tracking-[0.2em] text-white/80 uppercase'
            : 'text-sm tracking-[0.2em] text-[#6d4f48] uppercase'
        }
      >
        {applyCzechNbsp(subtitle)}
      </p>

      {description ? (
        <p
          className={
            light
              ? 'max-w-2xl text-[15px] leading-relaxed text-white/90'
              : 'max-w-2xl text-[15px] leading-relaxed text-[#6f5b56]'
          }
        >
          {applyCzechNbsp(description)}
        </p>
      ) : null}
    </div>
  )
}
