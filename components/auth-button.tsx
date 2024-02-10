import {signOut} from '@app/utils/actions/auth';
import {createClient} from '@app/utils/supabase/server';
import Link from 'next/link';
import {Fragment} from 'react';

const AuthButton = async (): Promise<JSX.Element> => {
	const supabase = createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	return (
		<Fragment>
			{user === null && (
				<Link
					href="/login"
					className="py-2 px-3 flex rounded-md no-underline bg-brand-primary hover:bg-brand-secondary"
				>
					Login
				</Link>
			)}
			{user !== null && (
				<div className="flex items-center gap-4">
					<Link
						href="/profile"
						className="py-2 px-3 flex rounded-md no-underline bg-brand-primary hover:bg-brand-secondary"
					>
						Profile
					</Link>
					<form action={signOut}>
						<button type="submit" className="py-2 px-4 rounded-md no-underline bg-brand-primary hover:bg-brand-secondary">
							Logout
						</button>
					</form>
				</div>
			)}
		</Fragment>
	);
};

export default AuthButton;