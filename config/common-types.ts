import type {Store} from './stores';

type Parameters = {
	id: string;
};

type ProductSize = {
	label: string;
	isAvailable: boolean;
};

type Product = {
	id: string;
	name: string;
	imageSrc: string;
	currentPrice: string;
	lowestPrice: string;
	highestPrice: string;
	sizes: ProductSize[];
	url: string;
	store: Store;
	onSale: boolean;
};

export type {
	Parameters as Params,
	Product,
	ProductSize,
};