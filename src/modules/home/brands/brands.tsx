"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import Image from 'next/image';

const Brands = () => {
	return (
		<div className='brands-cover'>
			<Swiper
				modules={[Autoplay]}
				slidesPerView="auto"
				spaceBetween={80}
				loop
				speed={25000}
				autoplay={{
					delay: 1,
					disableOnInteraction: false,
				}}
				allowTouchMove={false}
			>
				{
					Array.from({ length: 5 }).map((_, index) => (
						<SwiperSlide key={index} style={{ width: 'auto' }}>
							<div className="flex items-center gap-10 md:gap-12 lg:gap-16 2xl:gap-20">
									{Array.from({ length: 5 }).map((_, idx) => (
										<div
											key={idx}
											className="relative w-20 md:w-24 h-10"
										>
											<Image
												src={`/home/brands/img-${idx + 1}.png`}
												alt={`Brand ${index + 1}`}
												className="object-contain grayscale opacity-75"
												fill
												sizes="100%"
											/>
										</div>
									))}
								</div>
						</SwiperSlide>
					))
				}
			</Swiper>
		</div>
	);
};

export default Brands;