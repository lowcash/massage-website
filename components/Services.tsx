'use client'

import { Leaf, Flower } from 'lucide-react'

export default function Services() {
  const scrollToCalendar = () => {
    const element = document.getElementById('kalendar')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id='sluzby' className='px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='section-title'>Služby</h2>
          <p className='mx-auto max-w-2xl font-sans text-gray-600'>
            Nabízíme širokou škálu masáží a relaxačních procedur, které vám pomohou obnovit energii a najít vnitřní
            klid.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.map((service, index) => (
            <div key={index} className='service-card group' onClick={scrollToCalendar}>
              <div className='mb-4'>{service.icon}</div>
              <h3 className='service-title'>{service.name}</h3>
              <p className='service-description'>{service.description}</p>
              <div className='service-details'>
                {service.duration} – {service.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
  {
    icon: <Leaf className='text-studio-gold h-8 w-8' />,
    name: 'Thajská masáž nohou',
    description: 'Relaxační masáž zaměřená na chodidla a lýtka, která uvolňuje napětí a podporuje krevní oběh.',
    duration: '75 / 105 min',
    price: 'od 850,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-45' />,
    name: 'Aroma masáž',
    description: 'Uvolňující masáž s použitím esenciálních olejů pro relaxaci těla i mysli.',
    duration: '60 / 90 min',
    price: 'od 750,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Masáž lávovými kameny',
    description: 'Terapie horkými kameny pro hluboké uvolnění svalů a zlepšení krevního oběhu.',
    duration: '90 min',
    price: 'od 950,-',
  },
  {
    icon: <Flower className='text-studio-gold h-8 w-8' />,
    name: 'Relaxační masáž',
    description: 'Jemná masáž celého těla pro navození hluboké relaxace a úlevy od stresu.',
    duration: '60 / 90 min',
    price: 'od 750,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8' />,
    name: 'Masáž hlavy a šíje',
    description: 'Cílená masáž pro uvolnění napětí v oblasti hlavy, krku a ramen.',
    duration: '45 min',
    price: 'od 550,-',
  },
  {
    icon: <Leaf className='text-studio-gold h-8 w-8 rotate-180' />,
    name: 'Medová detoxikační masáž',
    description: 'Přírodní detoxikační terapie s použitím medu pro odstranění toxinů a zlepšení krevního oběhu.',
    duration: '60 min',
    price: 'od 800,-',
  },
]
