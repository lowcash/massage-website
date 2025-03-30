import { ServiceCard } from '@/app/_components/Services/ServiceCard'
import { TitleSection } from '@/components/ui/typo'

import { SECTIONS } from '@/config'

export default function Services() {
  return (
    <section id={SECTIONS[0].id} className='py-16 bg-gray-50'>
      <div className='mx-auto px-4'>
        <TitleSection>{SECTIONS[0].header}</TitleSection>

        <div className='flex flex-wrap justify-center gap-8 bg-gray-50'>
          {SERVICES.map((massage, index) => (
            <ServiceCard
              key={index}
              title={massage.title}
              description={massage.description}
              duration={massage.duration}
              icon={massage.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
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
