import {load} from 'cheerio';
import {isNil} from 'remeda';
import type {Product, ProductQuery, ProductSize, ProductSizeQuery} from '@app/config/common-types';
import {STORE_URL} from '@app/config/constants';

const isProductUrlValid = (urlString: string): boolean => {
	try {
		const url = new URL(urlString);

		return url.origin === STORE_URL;
	} catch {
		return false;
	}
};

const formatProductData = async (scrappedString: string, productUrl: string, previousProduct?: Product): Promise<ProductQuery> => {
	const $ = load(scrappedString);

	// Scrape product details from returned html
	const name = $('h1').text().trim();
	const productPrice = $('[data-test=product-price]').text().trim().replaceAll(/[^\d.]/g, '');
	const salePrice = $('[data-test=product-price-reduced]').text().trim().replaceAll(/[^\d.]/g, '');
	const category = $('[data-test=product-sub-title]').text().trim();
	const imageSource = $('#pdp_6up-hero').prop('src');

	// Scrape product sizes
	const dataString = scrappedString.split('"skus":').at(-1) ?? '';

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

	// TODO: Check if there's been any changes with the previousProduct and new product details
	// prior to updating the DB.

	const currentPrice = salePrice === '' ? Number.parseFloat(productPrice) : Number.parseFloat(salePrice);
	const lowestPrice = isNil(previousProduct) || previousProduct.lowestPrice > currentPrice ? currentPrice : previousProduct.lowestPrice;
	const highestPrice = isNil(previousProduct) || previousProduct.highestPrice < Number.parseFloat(productPrice) ? Number.parseFloat(productPrice) : previousProduct.highestPrice;
	const onSale = salePrice === '';

	return {
		name,
		imageSrc: imageSource ?? '',
		category,
		currentPrice,
		lowestPrice,
		highestPrice,
		sizes,
		onSale,
		url: productUrl,
	};
};

export {
	isProductUrlValid,
	formatProductData,
};