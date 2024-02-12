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

type ProductSizeQuery = {
	skuId: string;
	nikeSize: string;
};

type ProductQuery = Omit<Product, 'id'>;

export type {
	Parameters as Params,
	Product,
	ProductSize,
	ProductQuery,
	ProductSizeQuery,
};