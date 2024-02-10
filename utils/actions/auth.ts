'use server';

import {redirect} from 'next/navigation';
import {createClient} from '../supabase/server';
import {headers} from 'next/headers';

const signOut = async (): Promise<never> => {
	const supabase = createClient();
	await supabase.auth.signOut();

	return redirect('/login');
};

const signIn = async (formData: FormData): Promise<never> => {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = createClient();

	const {error} = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return redirect('/login?message=Could not authenticate user');
	}

	return redirect('/');
};

const signUp = async (formData: FormData): Promise<never> => {
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

export {
	signOut,
	signIn,
	signUp,
};