import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// let's get the session from the locals
	const session = await locals.auth.validate();

	if (!session) {
		return {};
	}

	redirect(303, '/app');
}) satisfies PageServerLoad;

const loginSchema = z.object({
	email: z.string().max(255).email(),
	password: z.string().min(6).max(100)
});

export const actions = {
	signin: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			console.log({ form });
			return fail(400, {
				message: 'Invalid credentials'
			});
		}
		try {
			const key = await auth.useKey('email', form.data.email, form.data.password);
			// console.log({ key });

			// to create a session we need the pass the userId which is the id of the user in the database
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			// console.log({ session });

			// now let's set the session so we can get the session everywhere in server like this page
			locals.auth.setSession(session);
		} catch (error) {
			console.log({ error });
			return fail(400, {
				message: 'Invalid credentials'
			});
		}

		redirect(303, '/app');
	}
} satisfies Actions;
