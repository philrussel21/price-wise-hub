/* eslint-disable unicorn/no-null */
'use server';

import {revalidatePath} from 'next/cache';
import axios from 'axios';
import {formatProductData, getExistingProduct, isProductUrlValid, upsertProduct} from '@app/data/product';
import type {PartialProductQuery, Product} from '@app/config/common-types';
import type {TrackingOption} from '@app/data/product-subscription';
import {upsertProductSubscription} from '@app/data/product-subscription';
import routes from '@app/config/routes';

const scrapeProduct = async (productUrl: string, previousProduct?: Product): Promise<PartialProductQuery | null> => {
	if (!isProductUrlValid(productUrl)) {
		return null;
	}

	// Bright Data proxy configuration
	const username = process.env.BRIGHT_DATA_USERNAME ?? '';
	const password = process.env.BRIGHT_DATA_PASSWORD ?? '';
	const sessionId = Math.trunc(1_000_000 * Math.random());
	const port = 22_225;
	const host = 'brd.superproxy.io';
	const options = {
		auth: {
			username: `${username}-session-${sessionId}`,
			password: password,
		},
		host,
		port,
		rejectUnauthorized: false,
	};

	try {
		const {data} = await axios.get<string>(productUrl, options);

		return await formatProductData(data, productUrl, previousProduct);
	} catch (error: unknown) {
		console.log(error);

		return null;
	}
};

const storeProduct = async (product: PartialProductQuery, productId?: string): Promise<string | null> => {
	try {
		const id = await upsertProduct(product, productId);
		revalidatePath(`${routes.products}/${id}`, 'page');

		return id;
	} catch (error) {
		console.log(error);

		return null;
	}
};

const checkDuplicateProduct = async (url: string): Promise<Product | null> => {
	try {
		return await getExistingProduct(url);
	} catch (error: unknown) {
		console.log(error);

		return null;
	}
};

const subscribeToProduct = async (productId: string, trackingOption: TrackingOption, productSubscriptionId?: string): Promise<string | null> => {
	try {
		return await upsertProductSubscription(productId, trackingOption, productSubscriptionId);
		// TODO: revalidate path where users can see the products they're subscribed to
	} catch (error) {
		console.log(error);

		return null;
	}
};

export {
	scrapeProduct,
	storeProduct,
	checkDuplicateProduct,
	subscribeToProduct,
};