/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import {isNil} from 'remeda';
import {PRODUCT_SUBSCRIPTIONS_TABLE} from '@app/config/constants';
import {createClient} from '@app/utils/supabase/server';

type TrackingOption = {
	isTrackingPrice: boolean;
	size: string;
};

const upsertProductSubscription = async (productId: string, trackingOption: TrackingOption, subscriptionId?: string): Promise<string> => {
	const supabase = createClient();

	const {data: {user}} = await supabase.auth.getUser();

	if (isNil(user)) {
		throw new Error('Error retrieving user details');
	}

	const {data, error} = await supabase
		.from(PRODUCT_SUBSCRIPTIONS_TABLE)
		.upsert({
			id: subscriptionId,
			product_id: productId,
			user_id: user.id,
			is_tracking_price: trackingOption.isTrackingPrice,
			size: trackingOption.size,
			is_active: true,
		})
		.select('id')
		.single<{id: string}>();

	if (!isNil(error)) {
		throw new Error(`Error upserting product supscription data: ${error.message}`);
	}

	if (isNil(data)) {
		throw new Error('Error retrieving product supscription data');
	}

	return data.id;
};

export {
	upsertProductSubscription,
};

export type {
	TrackingOption,
};