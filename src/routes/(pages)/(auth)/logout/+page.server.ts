import { auth } from '$lib/server/lucia';
import { db } from '$lib/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { log } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		const userId = session?.user.userId;

		if (!session || !userId) return fail(401);

		await db.insert(log).values({
			id: uuidv4(),
			userId: userId,
			message: 'User logged out'
		});

		// this is how we invalidate the session meang that the session is not valid anymore
		await auth.invalidateSession(session.sessionId);

		// now let's set the session to null
		locals.auth.setSession(null);

		// next we redirect to the login page
		redirect(303, '/sign-in');
	}
} satisfies Actions;
