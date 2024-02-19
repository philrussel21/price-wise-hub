import Image from 'next/image';
import {Button, Heading, Text} from './';

type ProductCardProperties = {
	imageSrc: string;
	name: string;
	lowestPrice: number;
	highestPrice: number;
	currentPrice: number;
	isOnSale: boolean;
	url: string;
};

const ProductCard = ({imageSrc, name, lowestPrice, highestPrice, currentPrice, url, isOnSale}: ProductCardProperties): JSX.Element => (
	<article className="flex gap-x-8 shadow-2xl rounded-2xl overflow-hidden">
		<Image
			width={600}
			height={400}
			alt={name}
			src={imageSrc}
			className="max-w-72"
		/>
		<div className="flex-grow py-8 pr-8 flex flex-col justify-between">
			<div className="space-y-2">
				<Heading variant="heading-two" element="h3" label={`${name}`}/>
				<div className="flex items-center">
					<Heading variant="heading-five" label="Lowest Price:"/>
					<Text variant="text-lead">{`$${lowestPrice}`}</Text>
				</div>
				<div className="flex items-center">
					<Heading variant="heading-five" label="Current Price:"/>
					<Text variant="text-lead" className={isOnSale ? 'text-red-500' : ''}>{`$${currentPrice}`}</Text>
				</div>
				<div className="flex items-center">
					<Heading variant="heading-five" label="Highest Price:"/>
					<Text variant="text-lead">{`$${highestPrice}`}</Text>
				</div>
			</div>
			<div className="flex flex-col gap-y-4">
				<Button.Link href={url} label="View"/>
				<Button.Link href="/" variant="secondary" label="Test"/>
			</div>
		</div>
	</article>
);

export default ProductCard;

export type {
	ProductCardProperties as ProductCardProps,
};