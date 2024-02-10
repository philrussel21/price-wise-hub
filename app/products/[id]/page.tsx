import {Button, Container, Heading, Region, Text} from '@app/components';
import type {Params} from '@app/config/common-types';
import Image from 'next/image';
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon, CurrencyDollarIcon} from '@heroicons/react/24/solid';
import type {Store} from '@app/config/stores';
import {stores} from '@app/config/stores';
import Link from 'next/link';

type ProductPageProperties = {
	params: Params;
};

const testData = {
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
	store: 'platypus',
	onSale: true,
};

const ProductPage = ({params}: ProductPageProperties): JSX.Element => {
	const {url, logo: Icon} = stores[testData.store as Store];

	return (
		<Region>
			<Container>
				<div className="flex flex-col lg:flex-row gap-x-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
					<div>
						<Image width={800} height={200} alt={testData.name} src={testData.imageSrc}/>
					</div>
					<div className="pl-8 lg:pl-0 py-8 pr-8 flex-grow">
						<Heading variant="heading-one" element="h1" label={`${testData.name}`}/>
						<Link href={url} target="_blank" rel="no-referrer" className="mt-2 inline-block">
							<span className="bg-black p-4 inline-block">
								<Icon className="w-48 h-18"/>
							</span>
						</Link>
						<div className="grid lg:grid-cols-3 gap-6 mt-6">
							<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
								<ArrowTrendingDownIcon className="w-10 text-green-500 fill-current"/>
								<Heading variant="heading-three" label="Lowest"/>
								<Text className="block" variant="text-lead">{testData.lowestPrice}</Text>
							</div>
							<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
								<CurrencyDollarIcon className="w-10 text-orange-500 fill-current"/>
								<Heading variant="heading-three" label="Current"/>
								<Text className="block" variant="text-lead">{testData.currentPrice}</Text>
							</div>
							<div className="rounded-2xl p-2 flex flex-col items-center bg-gray-200">
								<ArrowTrendingUpIcon className="w-10 text-red-500 fill-current"/>
								<Heading variant="heading-three" label="Highest"/>
								<Text className="block" variant="text-lead">{testData.highestPrice}</Text>
							</div>
						</div>
						<div className="mt-6">
							<Heading variant="heading-two" element="h2" label="Sizes"/>
							<ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
								{testData.sizes.map(size => (
									<li key={size.label}>
										<Text variant="text-lead" className={`p-4 bg-gray-200 block text-center rounded-2xl ${size.isAvailable ? '' : 'opacity-50'}`}>{size.label}</Text>
									</li>
								))}
							</ul>
						</div>
						<div className="mt-6 flex flex-col md:flex-row gap-6">
							<Button.Link label="View product" href={testData.url} target="_blank"/>
							<Button.Semantic label="Track Price"/>
						</div>
					</div>
				</div>
			</Container>
		</Region>
	);
};

export default ProductPage;

export type {
	ProductPageProperties as ProductPageProps,
};