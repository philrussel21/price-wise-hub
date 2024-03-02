import {signOut} from '@app/utils/actions/auth';
import {createClient} from '@app/utils/supabase/server';
import {Fragment} from 'react';
import Button from './button';
import routes from '@app/config/routes';

const AuthButton = async (): Promise<JSX.Element> => {
	const supabase = createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	return (
		<Fragment>
			{user === null && (
				<Button.Link href={routes.login} label="Login" className="px-6 bg-green-500"/>
			)}
			{user !== null && (
				<div className="flex items-center gap-4">
					<form action={signOut}>
						<Button.Semantic type="submit" label="Logout" className="px-6"/>
					</form>
				</div>
			)}
		</Fragment>
	);
};

export default AuthButton;