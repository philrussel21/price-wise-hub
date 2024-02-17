/* eslint-disable unicorn/no-null */
'use client';

import type {ChangeEvent, FormEvent} from 'react';
import {Fragment, useCallback, useState} from 'react';
import {Dialog} from '@headlessui/react';
import {isNil} from 'remeda';
import {Button, Heading, Text} from '@app/components';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {isProductUrlValid} from '@app/data/product';
import {checkDuplicateProduct, scrapeAndStoreProduct} from '@app/utils/actions/track';
import type {Product} from '@app/config/common-types';

type TrackButtonProperties = {
	hasUser: boolean;
	label: string;
	productId?: string;
};

const ERROR_MESSAGE = 'Unsupported store link. Please provide a valid link.';

const TrackButton = ({productId, label, hasUser}: TrackButtonProperties): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [hasError, setHasError] = useState(false);
	const [existingProduct, setExistingProduct] = useState<Product | null>(null);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setUrl('');
		setHasError(false);
		setExistingProduct(null);
		setIsModalOpen(false);
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setUrl(value);
	}, []);

	const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
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

		await scrapeAndStoreProduct(url);
	}, [url, hasUser]);

	if (isNil(productId)) {
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
								<div className="flex flex-col gap-y-4">
									<Text>
										Enter the url of product you&apos;d like to track
									</Text>
									<form className="flex flex-col gap-y-4 items-center" onSubmit={handleSubmit}>
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
										<Button.Semantic disabled={!hasUser} type="submit" label="Track price"/>
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
							</Dialog.Description>
						</Dialog.Panel>
					</div>
				</Dialog>
			</Fragment>
		);
	}

	return (
		// TODO: Add current product ID to user's tracked products
		<Button.Semantic label={label}/>
	);
};

export default TrackButton;

export type {
	TrackButtonProperties as TrackButtonProps,
};