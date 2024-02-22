import {Container, Heading, Region, Text, TrackButton} from '@app/components';
import ProductCarousel from '@app/components/product-carousel';
import type {Product} from '@app/config/common-types';
import routes from '@app/config/routes';
import {getAllProducts} from '@app/data/product';
import {createClient} from '@app/utils/supabase/server';
import Link from 'next/link';
import {isNil} from 'remeda';

const getData = async (): Promise<Product[]> => {
	try {
		return await getAllProducts(5);
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
		<Region className="!mt-10">
			<Container className="grid grid-cols-4 grid-rows-4 gap-7">
				<div className="shadow-md border-red-300/40 border min-h-44 rounded-2xl">
					<Link href="/" className="flex justify-center items-center p-8 h-full hover:underline">
						<Heading variant="heading-one" label="How to use"/>
					</Link>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 rounded-2xl">
					<Link href={routes.products} className="flex justify-center items-center p-8 h-full hover:underline">
						<Heading variant="heading-one" label="Products"/>
					</Link>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 rounded-2xl">
					<Link href="/" className="flex justify-center items-center p-8 h-full hover:underline">
						<Heading variant="heading-one" label="Contact us"/>
					</Link>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 row-span-2 rounded-2xl">Content</div>
				<div className="shadow-md border-red-300/40 border min-h-44 row-span-2 rounded-2xl overflow-hidden relative">
					<ProductCarousel products={products}/>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 col-span-2 row-span-2 rounded-2xl flex flex-col justify-center items-center p-8 gap-y-6">
					<Heading variant="heading-one" element="h1" label="SneakAlert"/>
					<Text>Lorem ipsum dolor sit amet consectetur adipiscing elit leo quam, primis nostra blandit nunc sagittis fames elementum nisi, vestibulum dictum massa nec facilisis justo platea nulla augue, aptent ridiculus nullam sapien class montes dis. Lacinia proin nisl felis ac vehicula, nascetur tempus potenti luctus interdum gravida, tortor dictumst ut duis.</Text>
					<TrackButton hasUser={!isNil(user)} label="Trigger modal"/>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 row-span-2 rounded-2xl overflow-hidden">
					<ProductCarousel products={products}/>
				</div>
				<div className="shadow-md border-red-300/40 border min-h-44 col-span-2 rounded-2xl">footer content</div>
				<div className="shadow-md border-red-300/40 border min-h-44 rounded-2xl">Supported stores</div>
			</Container>
		</Region>
	);
};

export default Index;