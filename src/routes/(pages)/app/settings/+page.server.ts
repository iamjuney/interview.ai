import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const nameSchema = z.object({
	user_id: z.string().max(16),
	first_name: z.string().min(3).max(20),
	last_name: z.string().min(3).max(20),
	image: z.string().optional()
});

export const actions = {
	updateName: async ({ request }) => {
		const form = await superValidate(request, nameSchema);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		try {
			// check if there is a photo
			if (form.data.image) {
				// update user in the database
				await db
					.update(user)
					.set({
						first_name: form.data.first_name,
						last_name: form.data.last_name,
						image: form.data.image
					})
					.where(eq(user.id, form.data.user_id));
			} else {
				// update user in the database
				await db
					.update(user)
					.set({
						first_name: form.data.first_name,
						last_name: form.data.last_name
					})
					.where(eq(user.id, form.data.user_id));
			}
		} catch (error) {
			console.error(error);
			return fail(400, {
				message: 'Error updating user'
			});
		}

		redirect(303, '/app');
	}
};
