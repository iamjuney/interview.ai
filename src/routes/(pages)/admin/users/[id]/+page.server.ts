import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const userDetails = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, params.id)
	});

	if (!userDetails) {
		return error(404, 'User not found');
	}

	return {
		userDetails
	};
}) satisfies PageServerLoad;
