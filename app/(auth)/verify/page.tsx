import {Container, Region} from '@app/components';

const VerifyPage = (): JSX.Element => (
	<Region>
		<Container className="text-center">
			<h2 className="text-4xl">Thanks for registering!</h2>
			<p>Before logging in, please verify your email address.</p>
		</Container>
	</Region>
);

export default VerifyPage;
