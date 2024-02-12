import Image from 'next/image';
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon, CurrencyDollarIcon} from '@heroicons/react/24/solid';
import type {Product} from '@app/config/common-types';
import {Button, Heading, Text} from '@app/components';

type ProductDetailsProperties = {
	product: Product;
};

const ProductDetails = ({product}: ProductDetailsProperties): JSX.Element => (
	<div className="flex flex-col lg:flex-row gap-x-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
		<div>
			<Image width={600} height={200} alt={product.name} src={product.imageSrc}/>
		</div>
		<div className="pl-8 lg:pl-0 py-8 pr-8 flex-grow">
			<Heading variant="heading-one" element="h1" label={`${product.name}`}/>
			<Heading variant="heading-three" element="h2" label={`${product.category}`}/>
			<div className="grid lg:grid-cols-3 gap-6 mt-6">
				<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
					<ArrowTrendingDownIcon className="w-10 text-green-500 fill-current"/>
					<Heading variant="heading-three" label="Lowest"/>
					<Text className="block" variant="text-lead">{product.lowestPrice}</Text>
				</div>
				<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
					<CurrencyDollarIcon className="w-10 text-orange-500 fill-current"/>
					<Heading variant="heading-three" label="Current"/>
					<Text className="block" variant="text-lead">{product.currentPrice}</Text>
				</div>
				<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
					<ArrowTrendingUpIcon className="w-10 text-red-500 fill-current"/>
					<Heading variant="heading-three" label="Highest"/>
					<Text className="block" variant="text-lead">{product.highestPrice}</Text>
				</div>
			</div>
			<div className="mt-6">
				<Heading variant="heading-four" element="h3" label="Sizes"/>
				<ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
					{product.sizes.map(size => (
						<li key={size.label}>
							<Text variant="text-lead" className={`p-4 bg-gray-200 block text-center rounded-2xl ${size.isAvailable ? '' : 'opacity-50'}`}>{size.label}</Text>
						</li>
					))}
				</ul>
			</div>
			<div className="mt-6 flex flex-col md:flex-row gap-6">
				<Button.Link label="View product" href={product.url} target="_blank"/>
				{/* TODO: Add logic when Tracking price */}
				<Button.Semantic label="Track Price"/>
			</div>
		</div>
	</div>
);

export default ProductDetails;

export type {
	ProductDetailsProperties as ProductDetailsProps,
};