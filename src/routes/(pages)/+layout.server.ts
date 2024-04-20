import type { LayoutServerLoad } from './$types';
import testimonials from '$lib/db/testimonials.json';

export const config = {
	runtime: 'edge'
};

export const load: LayoutServerLoad = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();

	return {
		hasSession: !!session,
		testimonials
	};
}) satisfies LayoutServerLoad;
