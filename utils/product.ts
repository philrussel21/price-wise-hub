import {STORE_URL} from '@app/config/constants';

const isProductUrlValid = (urlString: string): boolean => {
	try {
		const url = new URL(urlString);
		
		return url.origin === STORE_URL;
	} catch {
		return false;
	}
};

export {
	isProductUrlValid,
};