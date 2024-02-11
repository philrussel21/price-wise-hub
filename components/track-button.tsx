'use client';

import type {ChangeEvent, FormEvent} from 'react';
import {Fragment, useCallback, useState} from 'react';
import {Dialog} from '@headlessui/react';
import {isNil} from 'remeda';
import {Button, Heading, Text} from '@app/components';
import {XMarkIcon} from '@heroicons/react/24/solid';
import type {Store} from '@app/config/stores';
import {stores} from '@app/config/stores';
import Link from 'next/link';

type TrackButtonProperties = {
	label: string;
	productId?: string;
};

type StoreButtonProperties = {
	url: string;
	icon: React.ElementType;
};

const StoreButton = ({url, icon: Icon}: StoreButtonProperties): JSX.Element => (
	<Link href={url} className="inline-block p-4">
		<Icon className="bg-black w-56"/>
	</Link>
);

const ERROR_MESSAGE = 'Unsupported store link. Please provide a valid link from the supported stores above';

const TrackButton = ({productId, label}: TrackButtonProperties): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [hasError, setHasError] = useState(false);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setUrl(value);
	}, [stores]);

	const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const urlObject = new URL(url);
			const validValues = Object.keys(stores).map(store => stores[store as Store].url);

			if (!validValues.includes(urlObject.origin)) {
				setHasError(true);

				return;
			}
			setHasError(false);
		} catch {
			setHasError(true);
		}
	}, [stores, url]);

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
							<Dialog.Description>
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
										<Button.Semantic type="submit" label="Track price"/>
									</form>
									<div>
										<Heading variant="heading-four" label="Supported stores"/>
										<ul>
											{Object.keys(stores).map(store => (
												<li key={stores[store as Store].url} className="w-full">
													<StoreButton url={stores[store as Store].url} icon={stores[store as Store].logo}/>
												</li>
											))}
										</ul>
									</div>
									{hasError && (
										<Text className="p-4 bg-red-300 rounded-2xl">{ERROR_MESSAGE}</Text>
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