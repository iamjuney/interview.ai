import { auth, githubAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { db } from '$lib/db';
import { log } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			console.log(githubUser);
			const user = await createUser({
				attributes: {
					role: 'user',
					username: githubUser.login,
					first_name: githubUser.name!.split(' ')[0],
					last_name: githubUser.name!.split(' ')[1],
					email: githubUser.email!,
					image: githubUser.avatar_url,
					show_onboarding: true,
					created_at: new Date().toISOString()
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		await db.insert(log).values({
			id: uuidv4(),
			userId: user.userId,
			message: 'User logged in'
		});
		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app'
			}
		});
	} catch (e) {
		console.log(e);
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
