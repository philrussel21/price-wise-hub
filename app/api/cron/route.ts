/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import type {PartialProductQuery, Product, ProductQuery, ProductSize} from '@app/config/common-types';
import {getAllProducts, upsertProduct} from '@app/data/product';
import {scrapeProduct} from '@app/utils/actions/track';
import {NextResponse} from 'next/server';
import {isNil} from 'remeda';

type ProductUpdateType = {
	hasPriceChanged: boolean;
	hasSizesChanged: boolean;
	product: ProductQuery;
};

const hasDifferentSizes = (oldSizes: ProductSize[], newSizes: ProductSize[]): boolean => {
	if (oldSizes.length !== newSizes.length) {
		return true;
	}

	// eslint-disable-next-line unicorn/no-for-loop
	for (let index = 0; index < oldSizes.length; index++) {
		const oldSize = oldSizes[index];
		const newSize = newSizes[index];

		if (oldSize.isAvailable !== newSize.isAvailable) {
			return true;
		}

		if (oldSize.label !== newSize.label) {
			return true;
		}
	}

	return false;
};

const generateProductsToUpdate = (previousData: Product[], newData: PartialProductQuery[]): ProductUpdateType[] => {
	const productsToUpdate: ProductUpdateType[] = [];

	for (const product of newData) {
		let hasPriceChanged = false;
		let hasSizesChanged = false;
		const oldProductDetails = previousData.find(details => details.url === product.url);

		if (isNil(oldProductDetails)) {
			continue;
		}

		if (
			oldProductDetails.currentPrice !== product.current_price
			|| oldProductDetails.lowestPrice !== product.lowest_price
			|| oldProductDetails.highestPrice !== product.highest_price) {
			hasPriceChanged = true;
		}

		hasSizesChanged = hasDifferentSizes(oldProductDetails.sizes, product.sizes);

		if (!hasPriceChanged && !hasSizesChanged) {
			continue;
		}

		const updatedProduct = {
			hasPriceChanged,
			hasSizesChanged,
			product: {
				id: oldProductDetails.id,
				...product,
			},
		};

		productsToUpdate.push(updatedProduct);
	}

	return productsToUpdate;
};

export const GET = async (request: Request): Promise<NextResponse> => {
	const requestUrl = new URL(request.url);
	const secret = requestUrl.searchParams.get('secret');

	if (isNil(secret) || secret !== process.env.CRON_SECRET_TOKEN) {
		return NextResponse.json({error: 'Invalid secret token'}, {status: 403});
	}

	try {
		const allProducts = await getAllProducts();
		const scrapes = await Promise.all(allProducts.map(async (product) => await scrapeProduct(product.url, product)));
		const allValidScrapes = scrapes.filter(scrape => scrape !== null) as PartialProductQuery[];

		const productsToUpdate = generateProductsToUpdate(allProducts, allValidScrapes);

		// update db with new product details
		await Promise.all(productsToUpdate.map(async (updatedProduct) => await upsertProduct(updatedProduct.product, updatedProduct.product.id)));

		// TODO: send emails to subscribed user based on their subscription type
	} catch (error: unknown) {
		console.log(error);

		return NextResponse.json({error}, {status: 500});
	}

	// URL to redirect to after sign in process completes
	return NextResponse.json({message: 'Success'}, {status: 200});
};
