import {Open_Sans, Oswald} from 'next/font/google';
import {Header, ProgressBar} from '@app/components';
import './globals.css';

type RootLayoutProperties = {
	children: React.ReactNode;
};

export const metadata = {
	title: 'PriceWiseHub',
	description: 'PriceWiseHub',
};

const openSans = Open_Sans({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-sans',
});

const oswald = Oswald({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-sans-serif',
});

const RootLayout = ({children}: RootLayoutProperties): JSX.Element => (
	<html lang="en">
		<body className="antialiased">
			<ProgressBar>
				<main className={`${oswald.variable} ${openSans.variable} font-sans`}>
					<Header/>
					{children}
				</main>
			</ProgressBar>
		</body>
	</html>
);

export default RootLayout;