import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useEffect, useState } from 'react'
import { apiUrl } from './http'

const Hero = () => {
    const [banners, setBanners] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/banners`).then(res => res.json()).then(data => setBanners(data)).catch(err => console.error(err))
    }, [])

    return (
        <section className='section-1'>
            <Swiper spaceBetween={0} slidesPerView={1}>
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div
                        className="content"
                        style={{
                            backgroundImage: `url(${banner.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            height: "100%",
                            width: "100%"
                        }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export default Hero