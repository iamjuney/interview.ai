import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();

	return {
		hasSession: !!session
	};
}) satisfies LayoutServerLoad;
