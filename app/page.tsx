import {Button, Container, Heading, ProductCard, Region, Text, TrackButton} from '@app/components';
import type {ProductSlide} from '@app/components/product-carousel';
import ProductCarousel from '@app/components/product-carousel';
import type {Product} from '@app/config/common-types';
import routes from '@app/config/routes';
import {getAllProducts} from '@app/data/product';
import {createClient} from '@app/utils/supabase/server';
import {Fragment} from 'react';
import {isEmpty, isNil} from 'remeda';

const productSlides: ProductSlide[] = [
	{
		imageSrc: '/images/product-1.png',
		alt: 'Air force 1 07',
	},
	{
		imageSrc: '/images/product-2.png',
		alt: 'Air Jordan 1 low',
	},
	{
		imageSrc: '/images/product-3.png',
		alt: 'Air Jordan 1 mid',
	},
	{
		imageSrc: '/images/product-4.png',
		alt: 'Calm slides',
	},
	{
		imageSrc: '/images/product-5.png',
		alt: 'Jumpman Two Trey',
	},
];

const getData = async (): Promise<Product[]> => {
	try {
		return await getAllProducts(8);
	} catch (error) {
		console.log(error);

		return [];
	}
};

const Index = async (): Promise<JSX.Element> => {
	const supabase = createClient();
	const products = await getData();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	return (
		<Fragment>
			<Region>
				<Container className="flex gap-x-16">
					<div>
						<Heading variant="heading-one" element="h1" label="SneakAlert"/>
						<Text>Lorem ipsum dolor sit amet consectetur adipiscing elit leo quam, primis nostra blandit nunc sagittis fames elementum nisi, vestibulum dictum massa nec facilisis justo platea nulla augue, aptent ridiculus nullam sapien class montes dis. Lacinia proin nisl felis ac vehicula, nascetur tempus potenti luctus interdum gravida, tortor dictumst ut duis.</Text>
						<TrackButton hasUser={!isNil(user)} label="Trigger modal"/>
					</div>
					<div>
						<ProductCarousel productSlides={productSlides}/>
					</div>
				</Container>
			</Region>
			<Region>
				<Container className="text-center space-y-12">
					<Heading variant="heading-two" element="h2" label="See what others are tracking"/>
					{!isEmpty(products) && (
						<div className="grid grid-cols-2 gap-8">
							{products.map(product => (
								<ProductCard
									key={product.id}
									name={product.name}
									url={`${routes.products}/${product.id}`}
									imageSrc={product.imageSrc}
									lowestPrice={product.lowestPrice}
									highestPrice={product.highestPrice}
									currentPrice={product.currentPrice}
									isOnSale={product.onSale}
								/>
							))}
						</div>
					)}
					<Button.Link href={routes.products} label="View Products"/>
				</Container>
			</Region>
		</Fragment>
	);
};

export default Index;