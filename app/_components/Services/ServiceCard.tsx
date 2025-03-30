interface MassageCardProps {
  title: string
  description: string
  duration: string
  icon: React.ReactNode
}

export function ServiceCard({ title, description, duration, icon }: MassageCardProps) {
  return (
    <div
      className='relative w-full max-w-2xs bg-white rounded-xl p-8 text-center overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-[1.02]'
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {/* Dekorativní prvek v rohu */}
      <div className='absolute top-0 right-0 w-24 h-24 rounded-bl-full transform translate-x-12 -translate-y-12 bg-gray-100 opacity-20'></div>

      {/* Kruhová ikona */}
      <div className='mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-[var(--background-light)]'>
        <div className='text-2xl transition-transform duration-300 ease-in-out transform hover:rotate-12 text-[var(--dark-green)]'>
          {icon}
        </div>
      </div>

      {/* Obsah karty */}
      <div>
        <h3 className='text-3xl font-medium mb-3 text-[var(--dark-green)]'>{title}</h3>

        <p className='text-gray-600 mb-6 text-lg leading-relaxed'>{description}</p>

        <div className='text-2xl font-light text-[var(--gold)]'>{duration}</div>
      </div>
    </div>
  )
}
