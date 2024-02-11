import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { put, type PutBlobResult } from '@vercel/blob';
import { eq } from 'drizzle-orm';
import { LuciaError } from 'lucia';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const nameSchema = z.object({
	user_id: z.string().max(16),
	first_name: z.string().min(3).max(20),
	last_name: z.string().min(3).max(20)
});

const passwordSchema = z.object({
	email: z.string().email(),
	current_password: z.string().min(8).max(20),
	new_password: z.string().min(8).max(20),
	confirm_password: z.string().min(8).max(20)
});

export const actions = {
	updateName: async ({ request }) => {
		const body = await request.formData();

		let user_photo: File | undefined;
		const mobile_user_photo = body.get('mobile_user_photo') as File;
		const desktop_user_photo = body.get('desktop_user_photo') as File;

		// check if there is a photo
		if (mobile_user_photo.size > 0) {
			user_photo = mobile_user_photo;
		} else if (desktop_user_photo.size > 0) {
			user_photo = desktop_user_photo;
		}

		const form = await superValidate(body, nameSchema);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		try {
			// check if there is a photo
			if (user_photo) {
				// upload photo to the vercel blob
				const newBlob = (await put(`avatar/${user_photo.name}`, user_photo, {
					access: 'public'
				})) as PutBlobResult;
				if (!newBlob) {
					return fail(400, {
						message: 'Error uploading user photo'
					});
				}

				// update user in the database
				await db
					.update(user)
					.set({
						first_name: form.data.first_name,
						last_name: form.data.last_name,
						image: newBlob.url
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
	},

	updatePassword: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);

		const form = await superValidate(request, passwordSchema);

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		if (form.data.new_password !== form.data.confirm_password) {
			return fail(400, {
				message: 'Passwords do not match'
			});
		}

		try {
			await auth.useKey('email', form.data.email, form.data.current_password); // validate password too
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
				return fail(400, {
					message: 'Invalid password'
				});
			}
		}

		try {
			await auth.updateKeyPassword('email', form.data.email, form.data.new_password);

			// this is how we invalidate the session meang that the session is not valid anymore
			await auth.invalidateSession(session.sessionId);

			// now let's set the session to null
			locals.auth.setSession(null);
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
				return fail(400, {
					message: 'Invalid email'
				});
			}
		}

		redirect(303, '/sign-in');
	},

	deleteAccount: async ({ request, locals }) => {
		const form = await superValidate(
			request,
			z.object({
				user_id: z.string().max(16)
			})
		);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		try {
			const session = await locals.auth.validate();
			await auth.invalidateSession(session!.sessionId);

			// now let's set the session to null
			locals.auth.setSession(null);

			// delete user in the database
			await db.delete(user).where(eq(user.id, form.data.user_id));
		} catch (error) {
			console.error(error);
			return fail(400, {
				message: 'Error deleting user'
			});
		}

		redirect(303, '/sign-in');
	}
};
