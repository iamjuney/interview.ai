import type { PageLoad } from './$types';
import type { Interview } from '$lib/types';

export const load = (async () => {
	const in_progress: Interview[] = [];

	const completed: Interview[] = [];

	// all = inprogress and completed sorted by date-added desc
	const all = [...in_progress, ...completed].sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	return { all, in_progress, completed };
}) satisfies PageLoad;
