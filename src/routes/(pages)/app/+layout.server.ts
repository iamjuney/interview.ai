import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();

	if (!session) redirect(303, '/sign-in');

	return {
		user: session.user
	};
}) satisfies LayoutServerLoad;
