import { TransparentButton } from '@/components/ui/button'
import { SubTitleMain, TitleMain } from '@/components/ui/typo'

export default function Hero() {
  return (
    <section
      className='relative bg-cover bg-center h-screen flex items-center'
      style={{ backgroundImage: `url(${INTRO_IMAGE})` }}
    >
      <div className='container mx-auto px-4 text-center'>
        <TitleMain>Relaxační masáže pro vaše tělo i duši</TitleMain>
        <SubTitleMain>Objevte harmonii a klid prostřednictvím našich profesionálních služeb.</SubTitleMain>

        <div className='mt-6'>
          <TransparentButton>Rezervovat</TransparentButton>
        </div>
      </div>
    </section>
  )
}

const INTRO_IMAGE =
  'https://www.wellnessliving.com/knowledge-sharing/wp-content/uploads/2025/02/WL2.0-Massage-Hero-1x.jpg'
// const INTRO_IMAGE = 'https://pohlazenipoteleadusi.cz/img/carousel_1.png'
// const INTRO_IMAGE = 'https://cdn.prod.website-files.com/64c41d61b6ce013555885ea0/6677570127c2cea16e46cf84_hero_massage_therapist_marketing_agency.webp'
