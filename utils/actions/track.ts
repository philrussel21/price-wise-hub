'use server';

import axios from 'axios';
import {formatProductData, isProductUrlValid} from '../product';

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

	try {
		const {data} = await axios.get<string>(productUrl, options);

		const formattedProduct = await formatProductData(data, productUrl);
		console.log(formattedProduct);

		// Store product in database
	} catch (error: unknown) {
		console.log(error);
	}
};

export {
	scrapeAndStoreProduct,
};