/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import {load} from 'cheerio';
import {isNil} from 'remeda';
import type {PartialProductQuery, Product, ProductQuery, ProductSize, ProductSizeQuery} from '@app/config/common-types';
import {createClient} from '../utils/supabase/server';
import {PRODUCTS_TABLE, STORE_URL} from '@app/config/constants';

const formatDatabaseResponse = (data: ProductQuery): Product => ({
	id: data.id,
	name: data.name,
	category: data.category,
	imageSrc: data.image_src,
	currentPrice: data.current_price,
	lowestPrice: data.lowest_price,
	highestPrice: data.highest_price,
	sizes: data.sizes,
	url: data.url,
	onSale: data.is_on_sale,
});

const isProductUrlValid = (urlString: string): boolean => {
	try {
		const url = new URL(urlString);

		return url.origin === STORE_URL;
	} catch {
		return false;
	}
};

const formatProductData = async (scrappedString: string, productUrl: string, previousProduct?: Product): Promise<PartialProductQuery> => {
	// TODO: handle launch url differently
	const $ = load(scrappedString);

	// Scrape product details from returned html
	const name = $('h1:first').text().trim();
	const productPrice = $('[data-test=product-price]:first').text().trim().replaceAll(/[^\d.]/g, '');
	// const salePrice = $('[data-test=product-price-reduced]:first').text().trim().replaceAll(/[^\d.]/g, '');
	const salePrice = $('[data-test=product-price-reduced]:first').text().trim().replaceAll(/[^\d.]/g, '');
	const category = $('[data-test=product-sub-title]:first').text().trim();
	const imageSource = $('#pdp_6up-hero').prop('src');

	// Scrape product sizes
	const styleId = productUrl.split('/').at(-1) ?? '';
	const dataStringArray = scrappedString.split(`"${styleId}":`);
	const stringContainingId = dataStringArray.find(string => string.startsWith('{"id":"'));
	// Get product uuid eg. 11fc6f77-c2f7-54ee-998f-caabde6d5ade
	const productId = stringContainingId?.slice(7, 43) ?? '';
	const dataString = scrappedString.split('"skus":').find(string => string.includes(`"productId":"${productId}"`)) ?? '';
	const sizesArrayString = dataString.split(',"title"').at(0) ?? '';
	const sizesJson = await JSON.parse(sizesArrayString) as ProductSizeQuery[];
	const sizeSkuIds = sizesJson.map(size => ({
		label: size.nikeSize,
		skuId: size.skuId,
	}));

	// Create a regular expression pattern to match all occurrences of skuIds
	const pattern = new RegExp(sizeSkuIds.map(size => `\\b${size.skuId}\\b`).join('|'), 'g');

	// Match all occurrences in the dataString
	const occurrences = dataString.match(pattern) ?? [];

	// Determine size availability by checking the number of times the sizeSkuIds appeared in data string
	const sizes: ProductSize[] = sizeSkuIds.map(sizeItem => ({
		label: sizeItem.label,
		isAvailable: occurrences.filter(match => match === sizeItem.skuId).length > 1,
	}));

	const isOnSale = salePrice !== '';
	const currentPrice = isOnSale ? Number.parseFloat(salePrice) : Number.parseFloat(productPrice);
	const lowestPrice = isNil(previousProduct) || previousProduct.lowestPrice > currentPrice ? currentPrice : previousProduct.lowestPrice;
	const highestPrice = isNil(previousProduct) || previousProduct.highestPrice < Number.parseFloat(productPrice) ? Number.parseFloat(productPrice) : previousProduct.highestPrice;

	return {
		name,
		image_src: imageSource ?? '',
		category,
		current_price: currentPrice,
		lowest_price: lowestPrice,
		highest_price: highestPrice,
		sizes,
		url: productUrl,
		is_on_sale: isOnSale,
	};
};

const getAllProducts = async (limit = 1000): Promise<Product[]> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCTS_TABLE)
		.select()
		.limit(limit)
		.returns<ProductQuery[]>();

	if (!isNil(error)) {
		throw new Error(`Error getting the product: ${error.message}`);
	}

	if (isNil(data)) {
		throw new Error('Error retrieving products');
	}

	return data.map(product => formatDatabaseResponse(product));
};

const getProduct = async (id: string): Promise<Product> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCTS_TABLE)
		.select('*')
		.match({id})
		.single<ProductQuery>();

	if (!isNil(error)) {
		throw new Error(`Error getting the product: ${error.message}`);
	}

	if (isNil(data)) {
		throw new Error('Error retrieving product record');
	}

	return formatDatabaseResponse(data);
};

const getExistingProduct = async (url: string): Promise<Product | null> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCTS_TABLE)
		.select('*')
		.match({url})
		.maybeSingle<ProductQuery>();

	if (!isNil(error)) {
		throw new Error(`Error checking product by url: ${error.message}`);
	}

	if (isNil(data)) {
		return data;
	}

	return formatDatabaseResponse(data);
};

const upsertProduct = async (product: PartialProductQuery, productId?: string): Promise<string> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCTS_TABLE)
		.upsert({
			id: productId,
			...product,
		})
		.select('id')
		.single<{id: string}>();

	if (!isNil(error)) {
		throw new Error(`Error upserting product data: ${error.message}`);
	}

	if (isNil(data)) {
		throw new Error('Error retrieving product subscription record id');
	}

	return data.id;
};

export {
	isProductUrlValid,
	formatProductData,
	upsertProduct,
	getProduct,
	getExistingProduct,
	getAllProducts,
};