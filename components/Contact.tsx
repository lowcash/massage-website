import {
  SECTION,
  PHONE,
  EMAIL,
  ADDRESS,
  OPENING_HOURS_SATURDAY,
  OPENING_HOURS_SUNDAY,
  OPENING_HOURS_WORKDAYS,
} from '@/const'

export default function Contact() {
  return (
    <section id={SECTION.CONTACT.id} className='bg-studio-beige px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='section-title'>Kde mě najdete?</h2>
        </div>

        <div className='mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row'>
          <div className='rounded-2xl bg-white p-6 shadow-sm lg:w-1/2'>
            {/* <h3 className='text-studio-pink mb-4 text-xl font-medium'>Kde nás najdete</h3> */}

            <div className='mb-6'>
              <h4 className='mb-2 font-medium text-gray-800'>Adresa</h4>
              <address className='text-gray-600 not-italic' dangerouslySetInnerHTML={{ __html: ADDRESS }} />
            </div>

            <div className='mb-6'>
              <h4 className='mb-2 font-medium text-gray-800'>Otevírací doba</h4>
              <ul className='text-gray-600'>
                <li className='mb-1 flex justify-between'>
                  <span>Pondělí - Pátek</span>
                  <span>{OPENING_HOURS_WORKDAYS}</span>
                </li>
                <li className='mb-1 flex justify-between'>
                  <span>Sobota</span>
                  <span>{OPENING_HOURS_SATURDAY}</span>
                </li>
                <li className='flex justify-between'>
                  <span>Neděle</span>
                  <span>{OPENING_HOURS_SUNDAY}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='mb-2 font-medium text-gray-800'>Kontaktní údaje</h4>
              <ul className='text-gray-600'>
                <li className='mb-2 flex items-center'>
                  <svg
                    className='text-studio-gold mr-2 h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                  </svg>
                  <span>{PHONE}</span>
                </li>
                <li className='flex items-center'>
                  <svg
                    className='text-studio-gold mr-2 h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                  <span>{EMAIL}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl shadow-sm lg:w-1/2'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3885048659795!2d17.12444661318573!3d48.850801601119265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47132e50d40a6673%3A0x15ea7a6c27e74db8!2zTsOhcm9kbsOtIHTFmS4gMzgzLzE1LCA2OTUgMDEgSG9kb27DrW4gMQ!5e0!3m2!1scs!2scz!4v1747158426680!5m2!1scs!2scz'
              width='600'
              height='450'
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
