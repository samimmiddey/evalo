"use client";

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Image from 'next/image';

const Brands = () => {
	const [emblaRef] = useEmblaCarousel(
		{ loop: true, watchDrag: false },
		[AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false, speed: 1 })]
	);

	return (
		<div className='brands-cover'>
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index} className="flex-none" style={{ width: 'auto', marginRight: '80px' }}>
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
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Brands;