interface WaveDividerProps {
  topColor?: string
  bottomColor?: string
  flip?: boolean
}

export default function WaveDivider({ topColor = '#fff', bottomColor = '#fef8fb', flip = false }: WaveDividerProps) {
  return (
    <div
      className='relative w-full overflow-hidden'
      style={{
        backgroundColor: bottomColor,
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='relative block w-full'
        style={{ height: '80px' }}
        viewBox='0 0 1200 120'
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        <path d='M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z' fill={topColor} />
      </svg>
    </div>
  )
}
