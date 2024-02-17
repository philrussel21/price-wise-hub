/* eslint-disable unicorn/no-null */
'use server';

import {revalidatePath} from 'next/cache';
import axios from 'axios';
import {isNil} from 'remeda';
import {formatProductData, getExistingProduct, isProductUrlValid, upsertProduct} from '@app/data/product';
import type {PartialProductQuery, Product} from '@app/config/common-types';
import type {TrackingOption} from '@app/data/product-subscription';
import {upsertProductSubscription} from '@app/data/product-subscription';

const scrapeProduct = async (productUrl: string): Promise<PartialProductQuery | null> => {
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

		return await formatProductData(data, productUrl);
	} catch (error: unknown) {
		console.log(error);

		return null;
	}
};

const storeProduct = async (product: PartialProductQuery): Promise<string | null> => {
	let id;
	try {
		const response = await upsertProduct(product);

		if (!isNil(response.error)) {
			throw new Error(response.error.message);
		}

		// Unlikely scenario when there's no data and no error
		if (isNil(response.id)) {
			throw new Error('No id returned');
		}

		id = response.id;
		revalidatePath(`/products/${id}`, 'page');

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