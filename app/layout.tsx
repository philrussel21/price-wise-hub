import {Open_Sans, Oswald} from 'next/font/google';
import {Header, ProgressBar} from '@app/components';
import './globals.css';

type RootLayoutProperties = {
	children: React.ReactNode;
};

const metadata = {
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

// Force nextjs to not build pages covered by this layout statically
// as most of them contain dynamic and user-specific content.
const dynamic = 'force-dynamic';

const RootLayout = ({children}: RootLayoutProperties): JSX.Element => (
	<html lang="en" className={`${oswald.variable} ${openSans.variable} font-sans`}>
		<body className="antialiased">
			<ProgressBar>
				<main>
					<Header/>
					{children}
				</main>
			</ProgressBar>
		</body>
	</html>
);

export default RootLayout;

export {
	metadata,
	dynamic,
};