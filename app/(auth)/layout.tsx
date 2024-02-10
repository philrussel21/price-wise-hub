import {Fragment} from 'react';
import {createClient} from '@app/utils/supabase/server';
import {redirect} from 'next/navigation';

type AuthLayoutPageProperties = {
	children: React.ReactNode;
};

const AuthLayoutPage = async ({children}: AuthLayoutPageProperties): Promise<JSX.Element> => {
	const supabase = createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	if (user !== null) {
		return redirect('/');
	}

	return (
		<Fragment>
			{children}
		</Fragment>
	);
};

export default AuthLayoutPage;