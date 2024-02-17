/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import {isNil} from 'remeda';
import type {ProductSubscriptionQuery} from '@app/config/common-types';
import {PRODUCT_SUBSCRIPTIONS_TABLE} from '@app/config/constants';
import {createClient} from '@app/utils/supabase/server';

type TrackingOption = {
	isTrackingPrice: boolean;
	size: string;
};

const upsertProductSubscription = async (productId: string, trackingOption: TrackingOption, subscriptionId?: string): Promise<string | null> => {
	const supabase = createClient();

	const {data: {user}} = await supabase.auth.getUser();

	if (isNil(user)) {
		return null;
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
		.single<ProductSubscriptionQuery>();

	if (!isNil(error)) {
		throw new Error(`Error inserting product supscription data: ${error.message}`);
	}

	if (isNil(data)) {
		return data;
	}

	return data.id;
};

export {
	upsertProductSubscription,
};

export type {
	TrackingOption,
};