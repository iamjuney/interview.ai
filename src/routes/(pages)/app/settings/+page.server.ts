import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2; //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
	const result = sizeInBytes / (1024 * 1024);
	return +result.toFixed(decimalsNum);
};

const nameSchema = z.object({
	user_id: z.string().max(16),
	first_name: z.string().min(3).max(20),
	last_name: z.string().min(3).max(20)
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
				const newBlob = (await upload(user_photo.name, user_photo, {
					access: 'public',
					handleUploadUrl: '/api/upload/avatar'
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
	}
};
