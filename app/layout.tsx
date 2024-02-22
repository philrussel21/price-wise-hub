import {Header} from '@app/components';
import './globals.css';

type RootLayoutProperties = {
	children: React.ReactNode;
};

export const metadata = {
	title: 'PriceWiseHub',
	description: 'PriceWiseHub',
};

const RootLayout = ({children}: RootLayoutProperties): JSX.Element => (
	<html lang="en">
		<body className="antialiased">
			<main>
				<Header/>
				{children}
			</main>
		</body>
	</html>
);

export default RootLayout;