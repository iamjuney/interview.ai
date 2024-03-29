import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) return fail(401);

		// this is how we invalidate the session meang that the session is not valid anymore
		await auth.invalidateSession(session.sessionId);

		// now let's set the session to null
		locals.auth.setSession(null);

		// next we redirect to the login page
		redirect(303, '/sign-in');
	}
} satisfies Actions;
