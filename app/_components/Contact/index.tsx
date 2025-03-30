import { TitleSection } from '@/components/ui/typo'
import GoogleMap from '@/app/_components/Contact/GoogleMap'

import {
  ADRESS_LOCATION,
  ADRESS_NAME,
  MAPS_API_KEY,
  MAPS_CENTER,
  NAME,
  OPENING_HOURS_WEEKENDS,
  OPENING_HOURS_WORKDAYS,
  SECTIONS,
} from '@/config'

export default function Contact() {
  return (
    <section id={SECTIONS[3].id} className='max-w-5xl mx-auto w-full'>
      <TitleSection>{SECTIONS[3].header}</TitleSection>

      <div className='rounded-lg overflow-hidden shadow-lg border border-gray-200'>
        <GoogleMap apiKey={MAPS_API_KEY} markerTitle={NAME} center={MAPS_CENTER} zoom={17} />

        <div className='p-4 bg-white'>
          <div className='flex items-start space-x-3'>
            <div className='text-pink-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-gray-800 font-medium'>{ADRESS_NAME}</h3>
              <p className='text-gray-600 text-sm'>{ADRESS_LOCATION}</p>
              <p className='text-gray-500 text-xs mt-1'>
                {OPENING_HOURS_WORKDAYS}, {OPENING_HOURS_WEEKENDS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
