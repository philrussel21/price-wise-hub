'use server';

import axios from 'axios';
import {isNil} from 'remeda';
import cheerio from 'cheerio';
import {getProductType} from '../product';
import {formatPlatypusData} from '../stores/platypus';
import type {StoreProduct} from '@app/config/common-types';

const scrapeAndStoreProduct = async (productUrl: string): Promise<void> => {
	// const supabase = createClient();
	const productType = getProductType(productUrl);

	if (isNil(productType)) {
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
		// let storeProduct: StoreProduct;

		// switch (productType) {
		// 	case 'footlocker': {
		// 		// TODO: implement footlocker parsing
		// 		storeProduct = {
		// 			name: 'Test',
		// 		};
		// 		break;
		// 	}

		// 	default: {
		// 		storeProduct = formatPlatypusData(data);
		// 		break;
		// 	}
		// }
		console.log(data);

		// console.log(storeProduct);
	} catch (error: unknown) {
		console.log(error);
	}
};

export {
	scrapeAndStoreProduct,
};