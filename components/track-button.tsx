/* eslint-disable unicorn/no-null */
'use client';

import type {ChangeEvent, FormEvent} from 'react';
import {Fragment, useCallback, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog} from '@headlessui/react';
import {isNil} from 'remeda';
import {Button, Heading, Text} from '@app/components';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {isProductUrlValid} from '@app/data/product';
import {checkDuplicateProduct, scrapeProduct, storeProduct, subscribeToProduct} from '@app/utils/actions/track';
import type {PartialProductQuery, Product} from '@app/config/common-types';

type TrackButtonProperties = {
	hasUser: boolean;
	label: string;
};

type TrackingOptionsState = {
	isTrackingPrice: boolean;
	size: string;
};

const initialTrackingOptions: TrackingOptionsState = {
	isTrackingPrice: false,
	size: '',
};

const ERROR_MESSAGE = 'Unsupported store link. Please provide a valid link.';

const TrackButton = ({label, hasUser}: TrackButtonProperties): JSX.Element => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [hasError, setHasError] = useState(false);
	const [existingProduct, setExistingProduct] = useState<Product | null>(null);
	const [trackingOptions, setTrackingOptions] = useState<TrackingOptionsState>(initialTrackingOptions);
	const [product, setProduct] = useState<PartialProductQuery | null>(null);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setUrl('');
		setHasError(false);
		setExistingProduct(null);
		setProduct(null);
		setTrackingOptions(initialTrackingOptions);
		setIsModalOpen(false);
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value);
	}, []);

	const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setTrackingOptions(current => ({
			...current,
			isTrackingPrice: event.target.checked,
		}));
	}, []);

	const handleSelectChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		setTrackingOptions(current => ({
			...current,
			size: event.target.value,
		}));
	}, []);

	const handleSelectProductSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setExistingProduct(null);

		if (!hasUser) {
			return;
		}

		if (!isProductUrlValid(url)) {
			setHasError(true);

			return;
		}
		setHasError(false);
		const duplicate = await checkDuplicateProduct(url);

		if (!isNil(duplicate)) {
			setExistingProduct(duplicate);

			return;
		}

		const scrapedProduct = await scrapeProduct(url);

		if (isNil(scrapedProduct)) {
			// TODO: error when scraping the product
			return;
		}

		setProduct(scrapedProduct);
	}, [url, hasUser]);

	const handleTrackProduct = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isNil(product)) {
			return;
		}

		const productId = await storeProduct(product);

		if (isNil(productId)) {
			// TODO: error when storing the product
			return;
		}

		const productSubscriptionId = await subscribeToProduct(productId, trackingOptions);

		if (isNil(productSubscriptionId)) {
			// TODO: error when user subscribing to product
			return;
		}

		router.push(`/products/${productId}`);
	}, [product, trackingOptions]);

	return (
		<Fragment>
			<Button.Semantic label={label} onClick={handleOpenModal}/>
			<Dialog
				open={isModalOpen}
				className="relative z-50"
				onClose={handleCloseModal}
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<Dialog.Panel className="bg-white p-6 rounded-2xl relative w-96">
						<button type="button" className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2" onClick={handleCloseModal}>
							<XMarkIcon className="w-6"/>
						</button>
						<Dialog.Title>
							<Heading variant="heading-three" label="Track Product Price"/>
						</Dialog.Title>
						<Dialog.Description as="div">
							{isNil(product) && (
								<div className="flex flex-col gap-y-4">
									<Text>
										Enter the url of product you&apos;d like to track
									</Text>
									<form className="flex flex-col gap-y-4 items-center" onSubmit={handleSelectProductSubmit}>
										<label htmlFor="url" className="sr-only">URL</label>
										<input
											required
											id="url"
											placeholder="URL here"
											type="text"
											className="p-4 bg-gray-200 w-full rounded-lg"
											value={url}
											onChange={handleInputChange}
										/>
										<Button.Semantic disabled={!hasUser} type="submit" label="Select Product"/>
									</form>
									{hasError && (
										<Text className="p-4 bg-red-300 rounded-2xl">{ERROR_MESSAGE}</Text>
									)}
									{!hasUser && (
										<div className="bg-orange-300 rounded-2xl p-4">
											<Text>Please login or sign up to continue</Text>
											<div className="flex flex-col gap-y-2 mt-4">
												<Button.Link href="/login" label="Login"/>
												<Button.Link href="/sign-up" variant="secondary" label="Sign up"/>
											</div>
										</div>
									)}
									{!isNil(existingProduct) && (
										<Text>{existingProduct.name}</Text>
									)}
								</div>
							)}
							{!isNil(product) && (
								<div className="bg-green-300 rounded-2xl p-4">
									<Text>{product.name}</Text>
									<Text>Please select tracking options</Text>
									<form className="flex flex-col gap-y-2 mt-4" onSubmit={handleTrackProduct}>
										<div>
											<input id="isTrackingPrice" type="checkbox" checked={trackingOptions.isTrackingPrice} onChange={handleCheckboxChange}/>
											<label htmlFor="isTrackingPrice">Price change</label>
										</div>
										<div>
											<label htmlFor="sizes">Sizes</label>
											<select required id="sizes" value={trackingOptions.size} onChange={handleSelectChange}>
												<option disabled value="">Select an option</option>
												{product.sizes.map(size => (
													<option key={size.label} value={size.label}>{size.label}</option>
												))}
											</select>
										</div>
										<Button.Semantic disabled={!hasUser} type="submit" label="Track Product"/>
									</form>
								</div>
							)}
						</Dialog.Description>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Fragment>
	);
};

export default TrackButton;

export type {
	TrackButtonProperties as TrackButtonProps,
};