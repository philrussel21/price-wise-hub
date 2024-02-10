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

const Index = async (): Promise<JSX.Element> => {
	const isSupabaseConnected = await canInitSupabaseClient();

	return (
		<div className="flex-1 w-full flex flex-col gap-20 items-center">
			<nav className="w-full flex justify-center border-b h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					{isSupabaseConnected && <AuthButton/>}
				</div>
			</nav>
			<h1 className="text-5xl">Hello World</h1>
		</div>
	);
};

export default Index;