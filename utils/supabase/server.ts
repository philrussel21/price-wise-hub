'use server';

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {createServerClient, type CookieOptions} from '@supabase/ssr';
import type {SupabaseClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';

export const createClient = (): SupabaseClient => {
	const cookieStore = cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					try {
						cookieStore.set({name, value, ...options});
					} catch {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
				remove(name: string, options: CookieOptions) {
					try {
						cookieStore.set({name, value: '', ...options});
					} catch {
						// The `delete` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};
