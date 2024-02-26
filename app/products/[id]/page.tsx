import {notFound} from 'next/navigation';
import {isEmpty, isNil} from 'remeda';
import {Container, Region, Button, Heading, Text, ProductCard} from '@app/components';
import type {Params, Product} from '@app/config/common-types';
import {getAllProducts, getProduct} from '@app/data/product';
import Image from 'next/image';
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon, CurrencyDollarIcon} from '@heroicons/react/24/solid';
import {Fragment} from 'react';
import routes from '@app/config/routes';

type ProductPageProperties = {
	params: Params;
};

const priceContainerClasses = 'rounded-2xl p-2 flex flex-col items-center border shadow-sm';
const generateSizeClasses = (isAvailable: boolean): string => `p-4 block text-center border shadow-sm rounded-2xl ${isAvailable ? 'border-green-300' : 'opacity-50 border-gray-300'}`;

const getData = async (id: string): Promise<Product | null> => {
	try {
		return await getProduct(id);
	} catch (error: unknown) {
		console.log(error);

		// eslint-disable-next-line unicorn/no-null
		return null;
	}
};

const getProducts = async (): Promise<Product[]> => {
	try {
		return await getAllProducts(4);
	} catch (error) {
		console.log(error);

		return [];
	}
};

const ProductPage = async ({params}: ProductPageProperties): Promise<JSX.Element> => {
	const product = await getData(params.id);

	if (isNil(product)) {
		notFound();
	}

	const products = await getProducts();

	return (
		<Fragment>
			<Region>
				<Container>
					<div className="flex flex-col lg:flex-row-reverse gap-x-8">
						<div>
							<Image
								priority
								width={600}
								height={200}
								alt={product.name}
								src={product.imageSrc}
								className="rounded-2xl overflow-hidden sticky top-5"
							/>
						</div>
						<div className="pl-8 lg:pl-0 py-8 lg:pt-0 pr-8 flex-grow">
							<Heading variant="heading-one" element="h1" label={`${product.name}`}/>
							<Heading variant="heading-three" element="h2" label={`${product.category}`}/>
							<div className="grid lg:grid-cols-3 gap-6 mt-6">
								<div className={`${priceContainerClasses}border-green-300`}>
									<ArrowTrendingDownIcon className="w-10 text-green-500 fill-current"/>
									<Heading variant="heading-three" label="Lowest"/>
									<Text className="block" variant="text-lead">{`$${product.lowestPrice}`}</Text>
								</div>
								<div className={`${priceContainerClasses}border-orange-300`}>
									<CurrencyDollarIcon className="w-10 text-orange-500 fill-current"/>
									<Heading variant="heading-three" label="Current"/>
									<Text className="block" variant="text-lead">{`$${product.currentPrice}`}</Text>
								</div>
								<div className={`${priceContainerClasses}border-red-300`}>
									<ArrowTrendingUpIcon className="w-10 text-red-500 fill-current"/>
									<Heading variant="heading-three" label="Highest"/>
									<Text className="block" variant="text-lead">{`$${product.highestPrice}`}</Text>
								</div>
							</div>
							<div className="mt-6">
								<Heading variant="heading-four" element="h3" label="Sizes"/>
								<ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
									{product.sizes.map(size => (
										<li key={size.label}>
											<Text
												variant="text-lead"
												className={generateSizeClasses(size.isAvailable)}
											>
												{size.label}
											</Text>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-6 flex flex-col gap-5">
								<Button.Link label="View product" variant="secondary" href={product.url} target="_blank"/>
								{/* TODO: Add logic when Tracking price */}
								<Button.Semantic label="Track Price"/>
							</div>
						</div>
					</div>
				</Container>
			</Region>
			<Region>
				{!isEmpty(products) && (
					<Container className="mb-20">
						<Heading element="h2" variant="heading-two" label="See what others are tracking"/>
						<div className="grid grid-cols-2 gap-8 mt-12">
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
						<div className="mt-20 flex justify-center">
							<Button.Link label="All Products" href={routes.products}/>
						</div>
					</Container>
				)}
			</Region>
		</Fragment>
	);
};

export default ProductPage;

export type {
	ProductPageProperties as ProductPageProps,
};