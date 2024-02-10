import Link from 'next/link';
import {headers} from 'next/headers';
import {createClient} from '@app/utils/supabase/server';
import {redirect} from 'next/navigation';
import {Container, Region} from '@app/components';

type SignUpPageProperties = {
	searchParams: {
		message: string;
	};
};

const signUp = async (formData: FormData): Promise<never> => {
	'use server';

	const origin = headers().get('origin') ?? '';
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = createClient();

	const {error} = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/api/auth/callback`,
		},
	});

	if (error) {
		return redirect('/signup?message=Could not authenticate user');
	}

	return redirect('/verify');
};

const SignUpPage = ({searchParams}: SignUpPageProperties): JSX.Element => {
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
					Back to Home
				</Link>
				<form
					className="animate-in flex-1 flex flex-col w-full justify-center gap-"
					action={signUp}
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
					<button
						type="submit"
						className="border border-foreground/20 rounded-md px-4 py- mb-2"
					>
						Sign Up
					</button>
					<p className="text-sm">
						Already have an account?
						{' '}
						<Link href="/login" className="underline hover:no-underline">Log in</Link>
						{' '}
						instead
					</p>
					{searchParams.message && (
						<p className="mt-4 p-4 text-center">
							{searchParams.message}
						</p>
					)}
				</form>
			</Container>
		</Region>
	);
};

export default SignUpPage;
