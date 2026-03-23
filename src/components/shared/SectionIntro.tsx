interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  light?: boolean
}

export function SectionIntro({ id, title, subtitle, light = false }: SectionIntroProps) {
  return (
    <div className='mx-auto flex max-w-3xl flex-col items-center gap-3 text-center'>
      <h2
        id={id}
        className={light ? 'font-dancing text-4xl text-white md:text-5xl' : 'font-dancing text-4xl text-[#2f2523] md:text-5xl'}
      >
        {title}
      </h2>
      <p
        className={
          light
            ? 'text-sm tracking-[0.2em] text-white/80 uppercase'
            : 'text-sm tracking-[0.2em] text-[#8b706c] uppercase'
        }
      >
        {subtitle}
      </p>
    </div>
  )
}
