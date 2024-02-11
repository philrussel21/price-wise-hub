import {Container, ProductDetails, Region} from '@app/components';
import type {Params} from '@app/config/common-types';

type ProductPageProperties = {
	params: Params;
};

const testData = {
	id: '1',
	imageSrc: 'https://www.nike.com/au/t/air-force-1-07-shoes-lkVhs6/DC9486-101',
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