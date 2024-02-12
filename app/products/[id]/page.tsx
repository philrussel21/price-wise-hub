import {Container, ProductDetails, Region} from '@app/components';
import type {Params} from '@app/config/common-types';

type ProductPageProperties = {
	params: Params;
};

const testData = {
	id: '1',
	imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7196bf6b-fb84-4dcd-94ae-32e56df438fd/luka-2-bred-basketball-shoes-W1GZ1g.png',
	name: 'Arizona Black - Narrow',
	category: 'Basketball Shoes',
	currentPrice: 174.99,
	lowestPrice: 174.99,
	highestPrice: 200,
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