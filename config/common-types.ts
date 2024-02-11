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
	onSale: boolean;
};

type StoreProduct = Partial<Product>;

export type {
	Parameters as Params,
	Product,
	ProductSize,
	StoreProduct,
};