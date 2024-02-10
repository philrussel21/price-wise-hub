import {AuthButton} from '@app/components';
import {createClient} from '@app/utils/supabase/server';

const canInitSupabaseClient = (): boolean => {
	// This function is just for the interactive tutorial.
	// Feel free to remove it once you have Supabase connected.
	try {
		createClient();

		return true;
	} catch {
		return false;
	}
};

const Header = async (): Promise<JSX.Element> => {
	const isSupabaseConnected = await canInitSupabaseClient();

	return (
		<header>
			<nav className="w-full flex justify-center border-b h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<div>
						Logo here
					</div>
					{isSupabaseConnected && <AuthButton/>}
				</div>
			</nav>
		</header>
	);
}
;

export default Header;