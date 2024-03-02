import {Head, Html, Body, Container, Section, Text, Link, Heading, Button, Tailwind, Preview, Img, Hr} from '@react-email/components';
import type {Product} from '@app/config/common-types';
import routes from '@app/config/routes';

type RestockEmailProperties = {
	product: Product;
};

const APP_URL = 'https://www.sneakalert.me';

const RestockEmail = ({product}: RestockEmailProperties): JSX.Element => (
	<Html lang="en">
		<Head/>
		<Preview>{`Your size on ${product.name} is now back on stock!`}</Preview>
		<Tailwind>
			<Body className="bg-white my-auto mx-auto font-sans px-2">
				<Container className="border border-solid border-gray-300 rounded my-10 mx-auto p-5 max-w-md">
					<Section>
						<Link href={APP_URL} className="text-black">
							<Heading className="text-[30px] leading-10 tracking-[0.25px] font-semibold font-sansSerif text-center">
								SneakAlert
							</Heading>
						</Link>
					</Section>
					<Section>
						<Text className="text-base">
							Your tracked product size on
							{' '}
							<strong>{product.name}</strong>
							{' '}
							is now on
							{' '}
							<strong>back in stock!</strong>
						</Text>
					</Section>
					<Section className="mt-8 shadow-2xl rounded-2xl overflow-hidden bg-black text-white">
						<Img width={450} height={300} src={product.imageSrc} className="object-cover"/>
						<Section className="px-8">
							<Heading className="text-[30px] leading-10 tracking-[0.25px] font-semibold font-sansSerif">
								{product.name}
							</Heading>
						</Section>
					</Section>
					<Section className="text-center mt-8">
						<Button
							href={`${APP_URL}/${routes.products}/${product.id}`}
							className="p-4 inline-block rounded-2xl text-center bg-black text-white"
						>
							View Product
						</Button>
					</Section>
					<Hr className="border border-solid border-black mt-8 mx-0 w-full"/>
					<Text className="mt-8 text-gray-500">
						If you
						were not expecting this invitation, you can ignore this email. If
						you are concerned about your account&apos;s safety, please reply to
						this email to get in touch with us.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default RestockEmail;

export type {
	RestockEmailProperties as RestockEmailProps,
};