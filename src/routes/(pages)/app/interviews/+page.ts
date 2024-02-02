import type { PageLoad } from './$types';

export const load = (async () => {
	const in_progress = [
		{
			id: 1,
			date_added: '2024-01-24T01:49:43.168Z',
			title: 'Internship - Backend Developer',
			company: 'Accenture',
			status: 'in-progress',
			progress: 20,
			questions: 4,
			duration: '12 minutes',
			description:
				'As an Accenture Intern, you will gain experience in working at the forefront of technology, solve business challenges, develop innovative solutions and learn from inspiring leaders.'
		}
	];

	const completed = [
		{
			id: 2,
			date_added: '2024-01-23T01:49:43.168Z',
			title: 'Internship - Frontend Developer',
			company: 'Accenture',
			status: 'completed',
			progress: 100,
			questions: 4,
			duration: '12 minutes',
			description:
				'As an Accenture Intern, you will gain experience in working at the forefront of technology, solve business challenges, develop innovative solutions and learn from inspiring leaders.'
		}
	];

	// all = inprogress and completed sorted by date-added desc
	const all = [...in_progress, ...completed].sort((a, b) => {
		return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
	});

	return { all, in_progress, completed };
}) satisfies PageLoad;
