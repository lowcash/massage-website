'use client'

import React from 'react'
import Image from 'next/image'
import Calendar from '@/app/_components/Calendar'
// import Header from '@/app/_components/Header'

export default function Page() {
  return (
    <>
      <Navigation />

      <section
        className='relative bg-cover bg-center h-screen flex items-center'
        style={{
          // backgroundImage: "url('https://pohlazenipoteleadusi.cz/img/carousel_1.png')",
          backgroundImage:
            "url('https://www.wellnessliving.com/knowledge-sharing/wp-content/uploads/2025/02/WL2.0-Massage-Hero-1x.jpg')",
          // backgroundImage: "url('https://cdn.prod.website-files.com/64c41d61b6ce013555885ea0/6677570127c2cea16e46cf84_hero_massage_therapist_marketing_agency.webp')",
        }}
      >
        <div className='container mx-auto px-4 text-center'>
          {/* Title */}
          <h2
            className='text-4xl md:text-5xl lg:text-5xl font-semibold mb-4 text-white leading-tight'
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
              letterSpacing: '0.5px',
            }}
          >
            Relaxační masáže pro vaše tělo i duši
          </h2>
          {/* <h1 className='text-5xl font-bold text-white leading-snug'>Relaxační masáže pro vaše tělo i duši</h1> */}

          {/* Subtitle */}
          {/* <p className='mt-4 text-xl text-white'>
            Objevte harmonii a klid prostřednictvím našich profesionálních služeb.
          </p> */}

          <p
            className='text-xl md:text-2xl text-white/90 mb-8'
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Objevte harmonii a klid prostřednictvím našich profesionálních služeb.
          </p>

          {/* Call to Action */}
          <div className='mt-6'>
            <TransparentButton>Rezervovat</TransparentButton>
          </div>
        </div>
      </section>

      {/* Massages Section */}
      <section id='massages' className='py-16 bg-gray-50'>
        {/* <div className='container mx-auto px-4'> */}
        <div className='mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center text-gray-800 mb-12'>Vyberte si z našich masáží</h2>

          <MassageCardDemo />
        </div>
      </section>

      <section>
        <Calendar />
      </section>
    </>
  )
}

function TransparentButton({
  children,
  ...p
}: React.PropsWithChildren<Pick<React.ComponentProps<'button'>, 'onClick'>>) {
  return (
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
}

const Navigation = () => {
  const [activeSection, setActiveSection] = React.useState('home')

  const sections = [
    { id: 'services', label: 'Služby' },
    { id: 'about', label: 'O mně' },
    { id: 'contact', label: 'Kontakt' },
  ]

  // Hlavní barva pro aktivní prvky a hovery
  const primaryColor = 'rgb(188, 98, 145)'

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
      `}</style>

      <nav className='fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-opacity-15 backdrop-blur-md'>
        <div className='mx-auto flex items-center justify-between'>
          {/* Logo */}
          <div
            className='text-3xl font-bold'
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: primaryColor,
            }}
          >
            Pohlazení po těle a duši
          </div>

          {/* Navigation Links */}
          <div className='hidden md:flex space-x-6'>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  px-2 py-1 text-base uppercase tracking-wider transition-all duration-300 ease-in-out
                  relative cursor-pointer
                `}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                  color: activeSection === section.id ? 'rgb(223 180 202)' : 'white',
                  // color: 'white',
                  // textShadow: `0 1px 4px rgba(0, 0, 0, 0.3)`
                  textShadow: `0 1px 4px ${primaryColor}`,
                }}
              >
                {section.label}

                {/* Underline element for active and hover states */}
                <span
                  className='absolute left-0 right-0 bottom-0 h-0.5 transition-all duration-300 ease-in-out transform origin-left'
                  style={{
                    backgroundColor: primaryColor,
                    transform: activeSection === section.id ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                ></span>

                {/* Hover effect that only appears on non-active items */}
                {activeSection !== section.id && (
                  <span
                    className='absolute left-0 right-0 bottom-0 h-0.5 opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out transform origin-right'
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  ></span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden text-gray-700 hover:text-gray-900 focus:outline-none'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>

          {/* CTA Button */}
          {/* <button 
            className="hidden md:block px-5 py-2 rounded-md transition-all duration-300 ease-in-out text-white uppercase tracking-wider text-sm hover:bg-opacity-90"
            style={{
              backgroundColor: primaryColor,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            Rezervovat
          </button> */}
        </div>
      </nav>
    </>
  )
}

interface MassageCardProps {
  title: string
  description: string
  duration: string
  icon: React.ReactNode
}

const MassageCard = ({ title, description, duration, icon }: MassageCardProps) => {
  // Barvy použité v komponentě
  const colors = {
    darkGreen: '#2d4a43',
    lightBg: '#f7f8f6',
    gold: '#c4a861',
  }

  return (
    <div
      className='relative w-full max-w-2xs bg-white rounded-xl p-8 text-center overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-[1.02]'
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {/* Dekorativní prvek v rohu */}
      <div className='absolute top-0 right-0 w-24 h-24 rounded-bl-full transform translate-x-12 -translate-y-12 bg-gray-100 opacity-20'></div>

      {/* Kruhová ikona */}
      <div
        className='mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110'
        style={{ backgroundColor: colors.lightBg }}
      >
        <div
          className='text-2xl transition-transform duration-300 ease-in-out transform hover:rotate-12'
          style={{ color: colors.darkGreen }}
        >
          {icon}
        </div>
      </div>

      {/* Obsah karty */}
      <div>
        <h3 className='text-3xl font-medium mb-3' style={{ color: colors.darkGreen }}>
          {title}
        </h3>

        <p className='text-gray-600 mb-6 text-lg leading-relaxed'>{description}</p>

        <div className='text-2xl font-light' style={{ color: colors.gold }}>
          {duration}
        </div>
      </div>
    </div>
  )
}

const MassageCardDemo = () => {
  const massages = [
    {
      title: 'Hot Stone Therapy',
      description: 'Smooth, heated stones are placed on specific points to warm and loosen tight muscles.',
      duration: '75 / 105 min',
      icon: (
        <svg width='24' height='24' viewBox='0 0 256 256' fill='currentColor'>
          <path d='M216,152a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16h24A8,8,0,0,1,216,152Zm-40-48a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16ZM72,152a8,8,0,0,0,8,8h24a8,8,0,0,0,0-16H80A8,8,0,0,0,72,152Zm40-48a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Zm50.2,60.4c-14.9,14.2-39.5,14.2-54.4,0A8,8,0,1,0,96.6,175.6c20.7,19.8,54.1,19.8,74.8,0a8,8,0,0,0-9.2-13.2Z' />
        </svg>
      ),
    },
    {
      title: 'Aromatherapy',
      description:
        'Essential oils enhance a gentle Swedish massage to restore balance, release stress and stimulate the body.',
      duration: '60 / 90 min',
      icon: (
        <svg width='24' height='24' viewBox='0 0 256 256' fill='currentColor'>
          <path d='M182.23,169.32A24,24,0,0,1,176,192c0,13.25-11.65,24-26,24a8,8,0,0,1,0-16c5.83,0,10-3.26,10-8a8,8,0,0,0-8-8,24,24,0,0,1-24-24c0-9.14,5.16-17.51,13.58-21.92,26.15-13.79,30.21-41.69,31.26-57.9.07-1.12.13-2.11.2-3A8,8,0,0,1,184,72c4.68,0,10.85,14,10.85,24a98.14,98.14,0,0,1-12.62,73.32ZM88,152a24,24,0,0,0,48,0c0-9.88-6.92-18.6-16.89-23-1.14-.5-2.28-1-3.43-1.52l-1.11-.47c-7.39-3.2-12.17-5.42-16.68-10.72C91.46,108.33,88,97.86,88,86a46,46,0,0,1,46-46c16.79,0,32.46,9.24,40.64,24.13a8,8,0,1,0,14.09-7.63C177.33,34.33,156.43,24,134,24A62.06,62.06,0,0,0,72,86c0,15.4,4.43,29.11,12.56,38.81,6.7,8,13.82,11.47,21.35,14.69l1,.44c1.48.64,2.93,1.26,4.35,1.9A8,8,0,0,1,116,152a8,8,0,0,1-16,0Z' />
        </svg>
      ),
    },
    {
      title: 'Deep Tissue',
      description: 'Targets the deeper layers of muscle and connective tissue to release chronic patterns of tension.',
      duration: '60 / 90 min',
      icon: (
        <svg width='24' height='24' viewBox='0 0 256 256' fill='currentColor'>
          <path d='M174.4,101.15a8,8,0,0,1,1.45,11.25C166.54,125.16,155.28,128,144,128a8,8,0,0,1,0-16c7-.06,13.58-1.68,19.65-9.6a8,8,0,0,1,11.25-1.45ZM224,40V216a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V40A16,16,0,0,1,48,24H208A16,16,0,0,1,224,40ZM208,216V40H48V216H208ZM78.55,199.11a8,8,0,0,0,11.28,1.34l.09-.07A43.88,43.88,0,0,1,128,184a43.88,43.88,0,0,1,38.08,16.38l.09.07a8,8,0,1,0,9.94-12.55l-.1-.08a59.9,59.9,0,0,0-48-23.82,59.9,59.9,0,0,0-48,23.82l-.1.08A8,8,0,0,0,78.55,199.11ZM104,108a12,12,0,1,0-12-12A12,12,0,0,0,104,108Zm60-24a12,12,0,1,0,12,12A12,12,0,0,0,164,84Z' />
        </svg>
      ),
    },
  ]

  return (
    <div className='flex flex-wrap justify-center gap-8 bg-gray-50'>
      {massages.map((massage, index) => (
        <MassageCard
          key={index}
          title={massage.title}
          description={massage.description}
          duration={massage.duration}
          icon={massage.icon}
        />
      ))}
    </div>
  )
}
