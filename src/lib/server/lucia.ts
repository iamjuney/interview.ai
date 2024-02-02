import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import { db } from '@vercel/postgres';

export const auth = lucia({
	adapter: pg(db, {
		key: 'user_key',
		session: 'user_session',
		user: 'users'
	}),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (userData) => ({
		first_name: userData.first_name,
		last_name: userData.last_name,
		email: userData.email,
		image: userData.image
	}),
	middleware: sveltekit()
});

export type Auth = typeof auth;
