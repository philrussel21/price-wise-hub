import {Container, Heading, Region, Text, TrackButton} from '@app/components';
import type {ProductSlide} from '@app/components/product-carousel';
import ProductCarousel from '@app/components/product-carousel';
import {createClient} from '@app/utils/supabase/server';
import {isNil} from 'remeda';

const products: ProductSlide[] = [
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

const Index = async (): Promise<JSX.Element> => {
	const supabase = createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	return (
		<Region>
			<Container className="flex gap-x-16">
				<div>
					<Heading variant="heading-one" element="h1" label="Price Wise Hub"/>
					<Text>Lorem ipsum dolor sit amet consectetur adipiscing elit leo quam, primis nostra blandit nunc sagittis fames elementum nisi, vestibulum dictum massa nec facilisis justo platea nulla augue, aptent ridiculus nullam sapien class montes dis. Lacinia proin nisl felis ac vehicula, nascetur tempus potenti luctus interdum gravida, tortor dictumst ut duis.</Text>
					<TrackButton hasUser={!isNil(user)} label="Trigger modal"/>
				</div>
				<div>
					<ProductCarousel products={products}/>
				</div>
			</Container>
		</Region>
	);
};

export default Index;