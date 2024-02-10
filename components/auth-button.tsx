import {createClient} from '@app/utils/supabase/server';
import Link from 'next/link';
import {redirect} from 'next/navigation';

const AuthButton = async (): Promise<JSX.Element> => {
	const supabase = createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	const signOut = async (): Promise<never> => {
		'use server';

		const supabase = createClient();
		await supabase.auth.signOut();

		return redirect('/login');
	};

	return user ? (
		<div className="flex items-center gap-4">
			Hey,
			{' '}
			{user.email}
!
			<form action={signOut}>
				<button type="submit" className="py-2 px-4 rounded-md no-underline bg-brand-primary hover:bg-brand-secondary">
					Logout
				</button>
			</form>
		</div>
	) : (
		<Link
			href="/login"
			className="py-2 px-3 flex rounded-md no-underline bg-brand-primary hover:bg-brand-secondary"
		>
			Login
		</Link>
	);
};

export default AuthButton;