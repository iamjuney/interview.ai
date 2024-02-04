import { v4 as uuidv4 } from 'uuid';
import { interview, question } from './schema';
import { db } from './index';

const randomInterviewIds = [
	'9a8b5c9b-3b7a-4e9a-8f2b-2f0a3b3c4d5e',
	'9a8b5c9b-3b7a-4e9a-8f2b-2f0a3b3c4d5f',
	'9a8b5c9b-3b7a-4e9a-8f2b-2f0a3b3c4d5g'
];

async function seed() {
	await insertInterviews();
	await insertQuestions();
}

async function insertInterviews() {
	const interviews = [
		{
			id: randomInterviewIds[0],
			slug: 'intern-react-developer',
			position: 'Intern React Developer',
			company: 'Company A',
			company_url: 'https://company-a.com',
			description:
				'An Intern React Developer is responsible for developing web applications using React.js. They will work with other developers and product managers throughout the software development life cycle.'
		}
		// {
		// 	id: randomInterviewIds[1],
		// 	slug: 'junior-flutter-developer',
		// 	position: 'Junior Flutter Developer',
		// 	description:
		// 		'Flutter developers are highly skilled professionals who use analytical and programming skills in developing Android OS-compatible applications. Flutter app development includes using various tools to perform detailed analysis, design and develop applications, ensure regular maintenance and support for the mobile applications.'
		// },
		// {
		// 	id: randomInterviewIds[2],
		// 	slug: 'senior-react-developer',
		// 	position: 'Senior React Developer',
		// 	description:
		// 		'A Senior React Developer is responsible for developing web applications using React.js. They will work with other developers and product managers throughout the software development life cycle.'
		// }
	];

	await db.insert(interview).values(interviews);
}

async function insertQuestions() {
	const questionsList = [
		'What is React?',
		'Give some of React.js’ features.',
		'What are the main advantages of React.js?',
		'What is JSX?',
		'Describe an event in React.js?',
		'How do Lists work in React.js?',
		'Why are keys used in React.js Lists?',
		'Is HTML used in React?',
		'What is the release date of React?',
		'Can you tell two downsides of React?'
	];

	const questions = questionsList.map((question, index) => ({
		id: uuidv4(),
		interviewId: randomInterviewIds[0],
		slug: slugGenerator(question),
		question
	}));

	await db.insert(question).values(questions);
}

function slugGenerator(question: string) {
	return question.toLowerCase().replace(/ /g, '-');
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log('Seeding done!');
		process.exit(0);
	});
