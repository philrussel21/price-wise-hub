import * as SVG from '@app/components/svg';

type Store = keyof typeof stores;

const stores = {
	platypus: {
		url: 'https://www.platypusshoes.com.au',
		logo: SVG.Platypus,
	},
	footlocker: {
		url: 'https://www.footlocker.com.au',
		logo: SVG.Footlocker},
};

export {
	stores,
};

export type {
	Store,
};