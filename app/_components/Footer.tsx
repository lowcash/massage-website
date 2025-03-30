'use client'

import { ADRESS_LOCATION, EMAIL, NAME, OPENING_HOURS_WEEKENDS, OPENING_HOURS_WORKDAYS, PHONE } from '@/config'

export default function Footer() {
  return (
    <footer className='bg-gray-800 text-white py-8 mt-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>{NAME}</h3>
            <p>Poskytujeme profesionální masážní služby pro vaše zdraví a pohodu.</p>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Kontakt</h3>
            <p>{ADRESS_LOCATION}</p>
            <p>Tel: {PHONE}</p>
            <p>Email: {EMAIL}</p>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Otevírací doba</h3>
            <p>{OPENING_HOURS_WORKDAYS}</p>
            <p>{OPENING_HOURS_WEEKENDS}</p>
          </div>
        </div>

        <div className='mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm'>
          &copy; {new Date().getFullYear()} {NAME}. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  )
}
