import type {PostgrestError} from '@supabase/supabase-js';
import type {ProductQuery} from '@app/config/common-types';
import {createClient} from './server';
import {PRODUCTS_TABLE} from '@app/config/constants';

type PostgrestResponse = {
	id: string;
};

type DatabaseResponse = {
	id: string | null;
	error: PostgrestError | null;
};

const upsertProduct = async (product: ProductQuery, productId?: string): Promise<DatabaseResponse> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCTS_TABLE)
		.upsert({
			id: productId,
			...product,
		})
		.select('id')
		.single<PostgrestResponse>();

	return {
		// eslint-disable-next-line unicorn/no-null
		id: data?.id ?? null,
		error,
	};
};

export {
	upsertProduct,
};