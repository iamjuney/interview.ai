import { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const type = form.get('type') as string;
	const file = form.get('file') as File;

	const buffer = Buffer.from(await file.arrayBuffer());

	// write into tmp directory
	fs.writeFileSync(`/tmp/${file.name}`, buffer);

	try {
		// upload file to cloudinary
		switch (type) {
			case 'image':
				const img_signature = await cloudinary.uploader
					.upload(`/tmp/${file.name}`)
					.then((result) => {
						return result;
					});

				return json(img_signature.public_id, { status: 200 });
			case 'video':
				const vid_signature = await cloudinary.uploader
					.upload(`/tmp/${file.name}`, { resource_type: 'video' })
					.then((result) => {
						return result;
					});

				return json(vid_signature.public_id, { status: 200 });
			default:
				throw error(400, 'Invalid file type');
		}
	} catch (e) {
		console.error(e);
		throw error(500, (e as Error).message);
	}
};
