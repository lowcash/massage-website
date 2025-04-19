'use client'

import ReactMultiCarousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

interface Props extends Pick<React.ComponentProps<typeof ReactMultiCarousel>, 'deviceType' | 'autoPlaySpeed'> {}

export default function Carousel(p: React.PropsWithChildren<Props>) {
  return (
    <ReactMultiCarousel
      {...p}
      ssr // important! => deviceType has to be set due to ssr
      swipeable
      draggable
      // showDots
      infinite
      responsive={RESPONSIVE}
      autoPlay={p.deviceType !== 'mobile'}
      removeArrowOnDeviceType={['tablet', 'mobile']}
    >
      {p.children}
    </ReactMultiCarousel>
  )
}

const RESPONSIVE = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}
