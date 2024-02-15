import {notFound} from 'next/navigation';
import {isNil} from 'remeda';
import {Container, ProductDetails, Region} from '@app/components';
import type {Params, Product} from '@app/config/common-types';
import {getProduct} from '@app/data/product';

type ProductPageProperties = {
	params: Params;
};

const getData = async (id: string): Promise<Product | null> => {
	try {
		return await getProduct(id);
	} catch (error: unknown) {
		console.log(error);

		// eslint-disable-next-line unicorn/no-null
		return null;
	}
};

const ProductPage = async ({params}: ProductPageProperties): Promise<JSX.Element> => {
	const data = await getData(params.id);

	if (isNil(data)) {
		notFound();
	}

	return (
		<Region>
			<Container>
				<ProductDetails product={data}/>
			</Container>
		</Region>
	);
};

export default ProductPage;

export type {
	ProductPageProperties as ProductPageProps,
};