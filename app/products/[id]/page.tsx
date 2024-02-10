import {Container, ProductDetails, Region} from '@app/components';
import type {Params} from '@app/config/common-types';
import type {Store} from '@app/config/stores';

type ProductPageProperties = {
	params: Params;
};

const testData = {
	id: '1',
	imageSrc: 'https://www.platypusshoes.com.au/media/catalog/product/0/5/051793_bfblk_01.jpeg?auto=webp&quality=85&format=pjpg&width=100%25&fit=cover',
	name: 'Arizona Black - Narrow',
	currentPrice: '$174.99',
	lowestPrice: '$174.99',
	highestPrice: '$200.00',
	sizes: [
		{
			label: '5',
			isAvailable: true,
		},
		{
			label: '6',
			isAvailable: false,
		},
		{
			label: '7',
			isAvailable: true,
		},
		{
			label: '8',
			isAvailable: false,
		},
		{
			label: '9',
			isAvailable: true,
		},
		{
			label: '10',
			isAvailable: true,
		},
	],
	url: '/',
	store: 'platypus' as Store,
	onSale: true,
};

const ProductPage = ({params}: ProductPageProperties): JSX.Element => (
	<Region>
		<Container>
			<ProductDetails product={testData}/>
		</Container>
	</Region>
);

export default ProductPage;

export type {
	ProductPageProperties as ProductPageProps,
};