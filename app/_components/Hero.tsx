import { TransparentButton } from '@/components/ui/button'
import { SubTitleMain, TitleMain } from '@/components/ui/typo'
import Carousel from '@/components/ui/carousel'

import { HERO_SECTION_AUTOPLAY_SPEED } from '@/config'

interface Props extends React.ComponentProps<typeof Carousel> {}

export default function Hero(p: Props) {
  return (
    <>
      <Carousel deviceType={p.deviceType} autoPlaySpeed={HERO_SECTION_AUTOPLAY_SPEED}>
        <CarouselItem img={INTRO_IMAGE} />
        <CarouselItem img={INTRO_IMAGE_2} />
        <CarouselItem img={INTRO_IMAGE_3} />
      </Carousel>

      <section className='absolute flex h-screen w-full items-center bg-cover bg-center'>
        <div className='container mx-auto px-4 text-center'>
          <TitleMain>Relaxační masáže pro vaše tělo i duši</TitleMain>
          <SubTitleMain>Objevte harmonii a klid prostřednictvím našich profesionálních služeb.</SubTitleMain>

          <div className='mt-6'>
            <TransparentButton>Rezervovat</TransparentButton>
          </div>
        </div>
      </section>
    </>
  )
}

function CarouselItem(p: { img: string }) {
  return (
    <div
      className='relative flex h-screen items-center bg-cover bg-center'
      style={{ backgroundImage: `url(${p.img})` }}
    />
  )
}

const INTRO_IMAGE =
  'https://www.wellnessliving.com/knowledge-sharing/wp-content/uploads/2025/02/WL2.0-Massage-Hero-1x.jpg'
const INTRO_IMAGE_2 = 'https://pohlazenipoteleadusi.cz/img/carousel_1.png'
const INTRO_IMAGE_3 =
  'https://cdn.prod.website-files.com/64c41d61b6ce013555885ea0/6677570127c2cea16e46cf84_hero_massage_therapist_marketing_agency.webp'
