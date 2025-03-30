export const TitleMain = (p: React.PropsWithChildren) => (
  <h1
    {...p}
    className='text-4xl md:text-5xl lg:text-5xl font-semibold mb-4 text-white leading-tight'
    style={{
      fontFamily: "'Montserrat', sans-serif",
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
      letterSpacing: '0.5px',
    }}
  />
)

export const SubTitleMain = (p: React.PropsWithChildren) => (
  <h1
    {...p}
    className='text-xl md:text-2xl text-white/90 mb-8'
    style={{
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 300,
      textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
    }}
  />
)

export const TitleSection = (p: React.PropsWithChildren) => (
  <h3 {...p} className='text-3xl font-semibold mb-4 text-center text-gray-800' />
)
