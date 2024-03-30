import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import { pg } from '@lucia-auth/adapter-postgresql';
import { github } from "@lucia-auth/oauth/providers";
import { db } from '@vercel/postgres';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	adapter: pg(db, {
		key: 'user_key',
		session: 'user_session',
		user: 'users'
	}),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (userData) => ({
        username: userData.username,
		first_name: userData.first_name,
		last_name: userData.last_name,
		email: userData.email,
		image: userData.image
	}),
	middleware: sveltekit()
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
});

export type Auth = typeof auth;
