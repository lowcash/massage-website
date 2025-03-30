export const TransparentButton = ({
  children,
  ...p
}: React.PropsWithChildren<Pick<React.ComponentProps<'button'>, 'onClick'>>) => (
  <button
    {...p}
    className='relative px-10 py-3 text-lg font-semibold text-white border border-white rounded-2xl bg-transparent backdrop-blur-sm overflow-hidden transition-all group cursor-pointer'
  >
    {/* Wave effect */}
    <span className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300'></span>

    {/* Button text */}
    <span className='relative z-10 uppercase'>{children}</span>
  </button>
)
