import {Container, Heading, ProductCard, Region} from '@app/components';
import type {Product} from '@app/config/common-types';
import routes from '@app/config/routes';
import {getAllProducts} from '@app/data/product';
import {Fragment} from 'react';
import {isEmpty} from 'remeda';

const getData = async (): Promise<Product[]> => {
	try {
		return await getAllProducts();
	} catch (error) {
		console.log(error);

		return [];
	}
};

const ProductsPage = async (): Promise<JSX.Element> => {
	const products = await getData();

	return (
		<Fragment>
			<Region>
				<Container>
					<Heading element="h1" variant="heading-one" label="Products"/>
				</Container>
			</Region>
			<Region>
				<Container>
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
				</Container>
			</Region>
		</Fragment>
	);
};

export default ProductsPage;