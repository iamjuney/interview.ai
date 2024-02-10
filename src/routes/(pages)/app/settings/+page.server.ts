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
	last_name: z.string().min(3).max(20),
	user_photo: z
		.custom<FileList>()
		.refine((files) => {
			return Array.from(files ?? []).every((file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE);
		}, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
		.refine((files) => {
			return Array.from(files ?? []).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
		}, 'File type is not supported')
		.optional()
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
			if (form.data.user_photo) {
				const file = form.data.user_photo[0];

				const newBlob = (await upload(file.name, file, {
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
