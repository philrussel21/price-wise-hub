/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import type {PartialProductQuery, Product, ProductQuery, ProductSize} from '@app/config/common-types';
import {getAllProducts, upsertProduct} from '@app/data/product';
import {getProductSubscriptionsById} from '@app/data/product-subscription';
import {scrapeProduct} from '@app/utils/actions/track';
import {NextResponse} from 'next/server';
import {differenceWith, isEmpty, isNil, equals} from 'remeda';

type ProductUpdateType = {
	hasPriceChanged: boolean;
	updatedSizes: ProductSize[];
	product: ProductQuery;
};

const generateProductsToUpdate = (previousData: Product[], newData: PartialProductQuery[]): ProductUpdateType[] => {
	const productsToUpdate: ProductUpdateType[] = [];

	for (const product of newData) {
		let hasPriceChanged = false;
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

		const updatedSizes = differenceWith(oldProductDetails.sizes, product.sizes, equals);

		if (!hasPriceChanged && isEmpty(updatedSizes)) {
			continue;
		}

		const updatedProduct = {
			hasPriceChanged,
			updatedSizes,
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

		// Exit early if there's no need to update the db nor send notifications
		if (isEmpty(productsToUpdate)) {
			return NextResponse.json({message: 'Success'}, {status: 200});
		}

		// update db with new product details
		await Promise.all(productsToUpdate.map(async (updatedProduct) => await upsertProduct(updatedProduct.product, updatedProduct.product.id)));

		// Get all active product subscriptions via the list of updated products
		const allProductSubscriptionsArrays = await Promise.all(productsToUpdate.map(async (product) => await getProductSubscriptionsById(product.product.id)));
		const allProductSubscriptions = allProductSubscriptionsArrays.flat();

		// For each change in the product subscription record, send a notification based on user subscription type and property changed from the product update
		for (const productSubscription of allProductSubscriptions) {
			const updatedProduct = productsToUpdate.find(product => product.product.id === productSubscription.productId);

			// Unlikely scenario when a updated product is not in the list of product subscriptions to update
			if (isNil(updatedProduct)) {
				throw new Error(`Could not locate product ${productSubscription.id} from the list of updated products`);
			}

			const updatedSizesLabels = updatedProduct.updatedSizes.map(size => size.label);

			// TODO: replace with actual send email notification
			if (!isEmpty(updatedSizesLabels) && updatedSizesLabels.includes(productSubscription.size)) {
				// Send notification about product size availability based on chosen size
				console.log('Send notification about selected size availability');
			}

			// TODO: replace with actual send email notification
			if (updatedProduct.hasPriceChanged && updatedProduct.product.is_on_sale && productSubscription.isTrackingPrice) {
				console.log('Send notification about product sale');
			}
		}
	} catch (error: unknown) {
		console.log(error);

		return NextResponse.json({error}, {status: 500});
	}

	return NextResponse.json({message: 'Success'}, {status: 200});
};
