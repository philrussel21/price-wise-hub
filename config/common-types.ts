/* eslint-disable @typescript-eslint/naming-convention */
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
	category: string;
	imageSrc: string;
	currentPrice: number;
	lowestPrice: number;
	highestPrice: number;
	sizes: ProductSize[];
	url: string;
	onSale: boolean;
};

type ProductQuery = {
	name: string;
	category: string;
	image_src: string;
	current_price: number;
	lowest_price: number;
	sizes: ProductSize[];
	highest_price: number;
	is_on_sale: boolean;
	url: string;
};

type ProductSizeQuery = {
	skuId: string;
	nikeSize: string;
};

export type {
	Parameters as Params,
	Product,
	ProductSize,
	ProductQuery,
	ProductSizeQuery,
};