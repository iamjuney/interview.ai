import { auth } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const signupSchema = z.object({
	email: z.string().max(255).email(),
	password: z.string().min(6).max(100),
	confirm_password: z.string().min(6).max(100),

	// my custom fields
	first_name: z.string().min(3).max(20),
	last_name: z.string().min(3).max(20)
});

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) return {};

	redirect(303, '/app');
}) satisfies PageServerLoad;

export const actions = {
	register: async ({ request }) => {
		const form = await superValidate(request, signupSchema);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid credentials'
			});
		}

		if (form.data.password !== form.data.confirm_password) {
			return fail(400, {
				message: 'Passwords do not match'
			});
		}

		try {
			// this does two things:
			// 1. create a user in the database
			// 2. create a key in the database
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: form.data.email,
					// lucia gonna hash the password automatically for you and saved it in the collection of keys in the database
					password: form.data.password
				},
				// this is the user attributes we put into model of user, this data gonna be saved in the collection of users in the database
				attributes: {
					email: form.data.email,

					// my custom fields
					first_name: form.data.first_name,
					last_name: form.data.last_name,
					image: ''
				}
			});
		} catch (e) {
			if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
				return fail(400, {
					message: 'User already exists'
				});
			}
		}

		redirect(303, '/sign-in');
	}
} satisfies Actions;
