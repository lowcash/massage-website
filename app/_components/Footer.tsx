import { ADRESS_LOCATION, EMAIL, NAME, OPENING_HOURS_WEEKENDS, OPENING_HOURS_WORKDAYS, PHONE } from '@/config'

export default function Footer() {
  return (
    <footer className='mt-12 bg-gray-800 py-8 text-white'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>{NAME}</h3>
            <p>Poskytujeme profesionální masážní služby pro vaše zdraví a pohodu.</p>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>Kontakt</h3>
            <p>{ADRESS_LOCATION}</p>
            <p>Tel: {PHONE}</p>
            <p>Email: {EMAIL}</p>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>Otevírací doba</h3>
            <p>{OPENING_HOURS_WORKDAYS}</p>
            <p>{OPENING_HOURS_WEEKENDS}</p>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400'>
          &copy; {new Date().getFullYear()} {NAME}. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  )
}
