import type { PageLoad } from './$types';

export const csr = true;

export const load: PageLoad = () => {
	const jobPositions = [
		{
			id: '1',
			title: 'Junior Web Developer',
			description:
				'Junior web developers assist in the creation and maintenance of websites and web applications. They work under the guidance of senior developers and are responsible for coding, debugging, and ensuring the functionality and responsiveness of web projects.'
		},
		{
			id: '2',
			title: 'OJT Intern',
			description:
				'OJT interns are students who are undergoing on-the-job training as part of their course requirements. They are usually in their final year of college and are looking to gain real-world experience in their field of study.'
		}
	];

	const sections = [
		{
			id: '1',
			title: 'Personal',
			description:
				'This section assesses your soft skills and personal attributes crucial for success as a Junior Web Developer.',
			question: '2',
			duration: '25'
		},
		{
			id: '2',
			title: 'Technical',
			description:
				'This section evaluates your technical prowess as a Junior Web Developer through a series of specialized questions and challenges.',
			question: '2',
			duration: '20'
		}
	];

	return {
		jobPositions,
		sections
	};
};
