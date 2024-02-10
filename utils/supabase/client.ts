import {createBrowserClient} from '@supabase/ssr';

export const createClient = (): unknown =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
	);
