import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();
	const body = (await request.json()) as HandleUploadBody;

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (
				pathname: string
				/* clientPayload?: string, */
			) => {
				// Generate a client token for the browser to upload the file
				// ⚠️ Authenticate and authorize users before generating the token.
				// Otherwise, you're allowing anonymous uploads.

				return {
					allowedContentTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
					tokenPayload: JSON.stringify({
						// optional, sent to your server on upload completion
						// you could pass a user id from auth, or a value from clientPayload
						userId
					})
				};
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				// Get notified of client upload completion
				// ⚠️ This will not work on `localhost` websites,
				// Use ngrok or similar to get the full upload flow

				console.log('blob upload completed', blob, tokenPayload);

				try {
					// Run any logic after the file upload completed
					// const { userId } = JSON.parse(tokenPayload);
					// await db.update({ avatar: blob.url, userId });
				} catch (error) {
					throw new Error('Could not update user');
				}
			}
		});

		return json(jsonResponse);
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 400 });
	}
};
