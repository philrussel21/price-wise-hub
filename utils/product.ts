/* eslint-disable unicorn/no-null */
import type {Store} from '@app/config/stores';
import {stores} from '@app/config/stores';
import {isNil} from 'remeda';

const getProductType = (urlString: string): Store | null => {
	try {
		const url = new URL(urlString);
		// const validValues = Object.keys(stores).map(store => stores[store as Store].url);

		// return validValues.includes(url.origin);
		const productType = Object.keys(stores).find(store => stores[store as Store].url === url.origin);

		if (isNil(productType)) {
			return null;
		}

		return productType as Store;
	} catch {
		return null;
	}
};

export {
	getProductType,
};