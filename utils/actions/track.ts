'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import axios from 'axios';
import {isNil} from 'remeda';
import {formatProductData, isProductUrlValid} from '../product';
import {upsertProduct} from '../supabase/upsert-product';

const scrapeAndStoreProduct = async (productUrl: string): Promise<void> => {
	// const supabase = createClient();

	if (!isProductUrlValid(productUrl)) {
		return;
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
	let id;

	try {
		const {data} = await axios.get<string>(productUrl, options);

		const formattedProduct = await formatProductData(data, productUrl);
		const response = await upsertProduct(formattedProduct);

		if (!isNil(response.error)) {
			throw new Error(response.error.message);
		}

		// Unlikely scenario when there's no data and no error
		if (isNil(response.id)) {
			throw new Error('No id returned');
		}

		id = response.id;
	} catch (error: unknown) {
		console.log(error);
	} finally {
		if (isNil(id)) {
			redirect('/');
		}
		revalidatePath(`/products/${id}`, 'page');
		redirect(`/products/${id}`);
	}
};

export {
	scrapeAndStoreProduct,
};