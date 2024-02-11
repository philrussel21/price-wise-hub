import Link from 'next/link';
import {Container, Region} from '@app/components';
import {signIn} from '@app/utils/actions/auth';

type LoginPageProperties = {
	searchParams: {
		message: string;
	};
};

const LoginPage = ({searchParams}: LoginPageProperties): JSX.Element => {
	return (
		<Region>
			<Container className="flex-1 flex flex-col w-full p-8 sm:max-w-md mx-auto justify-center gap-2 bg-white shadow-2xl rounded-2xl">
				<Link
					href="/"
					className="py-2 rounded-md no-underline flex items-center group text-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
					>
						<polyline points="15 18 9 12 15 6"/>
					</svg>
					{' '}
				Back
				</Link>
				<form
					className="flex-1 flex flex-col w-full justify-center"
					action={signIn}
				>
					<label className="text-md" htmlFor="email">
					Email
					</label>
					<input
						required
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						placeholder="you@example.com"
					/>
					<label className="text-md" htmlFor="password">
					Password
					</label>
					<input
						required
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						type="password"
						name="password"
						placeholder="••••••••"
					/>
					<button type="submit" className="bg-green-700 rounded-md px-4 py- mb-2">
					Sign In
					</button>
					<p className="text-sm">
Don&apos;t have an account?
						{' '}
						<Link href="/sign-up" className="underline hover:no-underline">Sign up</Link>
						{' '}
instead
					</p>
					{searchParams.message && (
						<p className="mt-4 p-4 text-center bg-red-400 rounded-2xl">
							{searchParams.message}
						</p>
					)}
				</form>
			</Container>
		</Region>
	);
};

export default LoginPage;
