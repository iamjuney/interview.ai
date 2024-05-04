import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();
	const user = session?.user;

	if (!session) redirect(303, '/sign-in');
	if (user?.role !== 'admin') redirect(303, '/app');

	return {
		user
	};
}) satisfies LayoutServerLoad;
