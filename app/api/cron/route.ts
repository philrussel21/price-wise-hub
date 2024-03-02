/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import {revalidatePath} from 'next/cache';
import {NextResponse} from 'next/server';
import sendgrid from '@sendgrid/mail';
import {render} from '@react-email/render';
import {differenceWith, isEmpty, isNil, equals} from 'remeda';
import {SaleEmail, RestockEmail} from '@app/emails';
import {scrapeProduct} from '@app/utils/actions/track';
import {formatDatabaseResponse, getAllProducts, upsertProduct} from '@app/data/product';
import type {PartialProductQuery, Product, ProductQuery, ProductSize} from '@app/config/common-types';
import routes from '@app/config/routes';
import {getProductSubscriptionsById} from '@app/data/product-subscription';

type ProductUpdateType = {
	hasPriceChanged: boolean;
	updatedSizes: ProductSize[];
	product: ProductQuery;
};

type EmailNotificationType = 'restock' | 'sale';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');
const fromAddress = process.env.SENGRID_FROM_ADDRESS ?? '';

const sendEmailNotification = async (product: Product, recipient: string, type: EmailNotificationType): Promise<void> => {
	let htmlMail = render(SaleEmail({product}));
	let subject = `${product.name} on SALE!`;

	if (type === 'restock') {
		htmlMail = render(RestockEmail({product}));
		subject = `${product.name} Restock!`;
	}

	const options = {
		from: fromAddress,
		to: recipient,
		subject,
		html: htmlMail,
	};

	await sendgrid.send(options);
};

const generateProductsToUpdate = (previousData: Product[], newData: PartialProductQuery[]): ProductUpdateType[] => {
	const productsToUpdate: ProductUpdateType[] = [];

	for (const product of newData) {
		let hasPriceChanged = false;
		const oldProductDetails = previousData.find(details => details.url === product.url);

		if (isNil(oldProductDetails)) {
			continue;
		}

		if (
			oldProductDetails.currentPrice !== product.current_price
			|| oldProductDetails.lowestPrice !== product.lowest_price
			|| oldProductDetails.highestPrice !== product.highest_price) {
			hasPriceChanged = true;
		}

		const updatedSizes = differenceWith(oldProductDetails.sizes, product.sizes, equals);

		if (!hasPriceChanged && isEmpty(updatedSizes)) {
			continue;
		}

		const updatedProduct = {
			hasPriceChanged,
			updatedSizes,
			product: {
				id: oldProductDetails.id,
				...product,
			},
		};

		productsToUpdate.push(updatedProduct);
	}

	return productsToUpdate;
};

export const GET = async (request: Request): Promise<NextResponse> => {
	const requestUrl = new URL(request.url);
	const secret = requestUrl.searchParams.get('secret');

	if (isNil(secret) || secret !== process.env.CRON_SECRET_TOKEN) {
		return NextResponse.json({error: 'Invalid secret token'}, {status: 403});
	}

	try {
		const allProducts = await getAllProducts();
		const scrapes = await Promise.all(allProducts.map(async (product) => await scrapeProduct(product.url, product)));
		const allValidScrapes = scrapes.filter(scrape => scrape !== null) as PartialProductQuery[];

		const productsToUpdate = generateProductsToUpdate(allProducts, allValidScrapes);

		// Exit early if there's no need to update the db nor send notifications
		if (isEmpty(productsToUpdate)) {
			return NextResponse.json({message: 'Success'}, {status: 200});
		}

		// revalidate page and update db with new product details
		await Promise.all(productsToUpdate.map(async (updatedProduct) => {
			revalidatePath(`${routes.products}/${updatedProduct.product.id}`, 'page');

			return await upsertProduct(updatedProduct.product, updatedProduct.product.id);
		},
		));

		// Get all active product subscriptions via the list of updated products
		const allProductSubscriptionsArrays = await Promise.all(productsToUpdate.map(async (product) => await getProductSubscriptionsById(product.product.id)));
		const allProductSubscriptions = allProductSubscriptionsArrays.flat();

		// For each change in the product subscription record, send a notification based on user subscription type and property changed from the product update
		for (const productSubscription of allProductSubscriptions) {
			const updatedProduct = productsToUpdate.find(product => product.product.id === productSubscription.productId);

			// Unlikely scenario when a updated product is not in the list of product subscriptions to update
			if (isNil(updatedProduct)) {
				throw new Error(`Could not locate product ${productSubscription.id} from the list of updated products`);
			}

			const updatedSizesLabels = updatedProduct.updatedSizes.map(size => size.label);
			const formattedUpdatedProduct = formatDatabaseResponse(updatedProduct.product);

			if (!isEmpty(updatedSizesLabels) && updatedSizesLabels.includes(productSubscription.size)) {
				// Send notification about product size availability based on subscribed size
				sendEmailNotification(formattedUpdatedProduct, productSubscription.userEmail, 'restock');
			}

			if (updatedProduct.hasPriceChanged && updatedProduct.product.is_on_sale && productSubscription.isTrackingPrice) {
				// Send notification about product price reduction
				sendEmailNotification(formattedUpdatedProduct, productSubscription.userEmail, 'sale');
			}
		}
	} catch (error: unknown) {
		console.log(error);

		return NextResponse.json({error}, {status: 500});
	}

	return NextResponse.json({message: 'Success'}, {status: 200});
};
