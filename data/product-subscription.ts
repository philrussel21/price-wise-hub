/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import {isNil} from 'remeda';
import {PRODUCT_SUBSCRIPTIONS_TABLE} from '@app/config/constants';
import {createClient} from '@app/utils/supabase/server';
import type {ProductSubscription, ProductSubscriptionQuery, UserQuery} from '@app/config/common-types';

type TrackingOption = {
	isTrackingPrice: boolean;
	size: string;
};

type UserRelationshipQuery = {
	user: UserQuery;
};

type UserProductSubscription = ProductSubscriptionQuery & UserRelationshipQuery;

const formatDatabaseResponse = (data: UserProductSubscription): ProductSubscription => ({
	id: data.id,
	productId: data.product_id,
	isTrackingPrice: data.is_tracking_price,
	isActive: data.is_active,
	size: data.size,
	userEmail: data.user.email,
});

const getProductSubscriptionsById = async (productId: string): Promise<ProductSubscription[]> => {
	const supabase = createClient();

	const {data, error} = await supabase
		.from(PRODUCT_SUBSCRIPTIONS_TABLE)
		.select('*, user: user_id(email)')
		.match({product_id: productId, is_active: true})
		.returns<UserProductSubscription[]>();

	if (!isNil(error)) {
		throw new Error(`Error fetching product subscriptions: ${error.message}`);
	}

	if (isNil(data)) {
		throw new Error('Error fetching product subscription');
	}

	return data.map(item => formatDatabaseResponse(item));
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
	getProductSubscriptionsById,
};

export type {
	TrackingOption,
};