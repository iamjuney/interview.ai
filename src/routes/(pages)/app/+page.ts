import type { PageLoad } from './$types';

export const load = (async () => {
	const interviews = [
		{
			id: 3,
			date_added: '2024-01-24T01:49:43.168Z',
			title: 'Internship - Full Stack Developer',
			company: 'Accenture',
			questions: 4,
			duration: '12 minutes',
			description:
				'As an Accenture Intern, you will gain experience in working at the forefront of technology, solve business challenges, develop innovative solutions and learn from inspiring leaders.'
		}
	];

	return { interviews };
}) satisfies PageLoad;
