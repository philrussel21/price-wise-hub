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
	id: string;
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

type PartialProductQuery = Omit<ProductQuery, 'id'>;

type ProductSizeQuery = {
	skuId: string;
	nikeSize: string;
};

type ProductSubscription = {
	id: string;
	productId: string;
	isTrackingPrice: boolean;
	size: string;
	isActive: boolean;
};

type ProductSubscriptionQuery = {
	id: string;
	product_id: string;
	is_tracking_price: boolean;
	size: string;
	is_active: boolean;
};

type PartialProductSubscriptionQuery = Omit<ProductSubscriptionQuery, 'id'>;

export type {
	Parameters as Params,
	Product,
	ProductSize,
	ProductQuery,
	ProductSizeQuery,
	PartialProductQuery,
	ProductSubscription,
	ProductSubscriptionQuery,
	PartialProductSubscriptionQuery,
};