import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	const showOnboarding = user.show_onboarding;

	if (!session) redirect(303, '/sign-in');
	if (user?.username === 'admin') redirect(303, '/admin');

	return {
		user,
		showOnboarding
	};
}) satisfies LayoutServerLoad;
