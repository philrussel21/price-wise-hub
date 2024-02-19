'use client';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import Image from 'next/image';

type ProductSlide = {
	imageSrc: string;
	alt: string;
};

type ProductCarouselProperties = {
	productSlides: ProductSlide[];
};

const ProductCarousel = ({productSlides}: ProductCarouselProperties): JSX.Element => (
	<Carousel
		// TODO: uncomment on launch
		// autoPlay
		// infiniteLoop
		showStatus={false}
		showThumbs={false}
		showArrows={false}
	>
		{productSlides.map(product => (
			<div key={product.alt}>
				<Image
					width={600}
					height={300}
					src={product.imageSrc}
					alt={product.alt}
					className="rounded-3xl"
				/>
			</div>
		))}
	</Carousel>
);

export default ProductCarousel;

export type {
	ProductCarouselProperties as ProductCarouselProps,
	ProductSlide,
};