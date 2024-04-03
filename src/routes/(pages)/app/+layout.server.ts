import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }: { locals: any }) => {
	const session = await locals.auth.validate();
	const showOnboarding = session?.user.show_onboarding;

	if (!session) redirect(303, '/sign-in');

	return {
		user: session.user,
		showOnboarding: showOnboarding
	};
}) satisfies LayoutServerLoad;
