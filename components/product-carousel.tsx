'use client';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import Image from 'next/image';
import type {Product} from '@app/config/common-types';
import Heading from './heading';
import Link from 'next/link';
import routes from '@app/config/routes';

type ProductSlide = {
	imageSrc: string;
	alt: string;
};

type ProductCarouselProperties = {
	products: Product[];
};

const ProductCarousel = ({products}: ProductCarouselProperties): JSX.Element => (
	<Carousel
		// TODO: uncomment on launch
		// autoPlay
		// infiniteLoop
		// Random interval between 3000 and 5000 ms
		// interval={Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000}
		showStatus={false}
		showThumbs={false}
		showArrows={false}
	>
		{products.map(product => (
			<Link key={product.id} href={`${routes.products}/${product.id}`}>
				<div className="h-full relative">
					<Image
						width={600}
						height={400}
						src={product.imageSrc}
						alt={product.name}
						className="h-full object-cover"
					/>
					<div className="absolute top-0 left-0 right-0 w-full z-10">
						<div className="bg-black p-4">
							<Heading variant="heading-three" element="h3" label={product.name} className="text-white uppercase text-center line-clamp-1"/>
						</div>
						{product.onSale && (
							<div className="bg-red-500 text-yellow-400 text-center py-1">
								<Heading variant="heading-six" label="SALE" className="font-black"/>
							</div>
						)}
					</div>
				</div>
			</Link>
		))}
	</Carousel>
);

export default ProductCarousel;

export type {
	ProductCarouselProperties as ProductCarouselProps,
	ProductSlide,
};