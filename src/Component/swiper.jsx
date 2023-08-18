
import { EffectCards, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards'
import { Box } from '@mui/material';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';


const SwiperSlider = () => {
  return (
    <Box width={500} ml={5}>
    <Swiper
      // install Swiper modules
      modules={[ EffectCards , A11y]}
      spaceBetween={50}
      loop={true}
      effect='cards'
    //   navigation
    //   pagination={{ clickable: true }}
    //   scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide><Box height={500} bgcolor={'red'}>
      Slide 1
        </Box> </SwiperSlide>
        <SwiperSlide><Box height={500} bgcolor={'blue'}>
      Slide 2
        </Box> </SwiperSlide>
      ...
    </Swiper>
    </Box>
  )
}

export default SwiperSlider;

