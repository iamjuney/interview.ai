import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import { interview, question } from './schema';

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
			difficulty: 'Basic',
			duration: 30,
			description:
				'An Intern React Developer is responsible for developing web applications using React.js. They will work with other developers and product managers throughout the software development life cycle.'
		},
		{
			id: randomInterviewIds[1],
			slug: 'junior-java-developer',
			position: 'Junior Java Developer',
			difficulty: 'Intermediate',
			duration: 45,
			description:
				'A Java developer is a highly skilled individual who can build highly efficient enterprise applications and can also work on software analysis and troubleshooting. '
		},
		{
			id: randomInterviewIds[2],
			slug: 'laravel-developer',
			position: 'Laravel Developer',
			difficulty: 'Advanced',
			duration: 60,
			description:
				'A Laravel developer is responsible for developing web applications using Laravel. They will work with other developers and product managers throughout the software development life cycle.'
		}
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

	const questionsList2 = [
		'Give some important features of Java.',
		'Name the types of memory allocations in Java.',
		'As a language, Java is considered platform-independent. Why?',
		'What is data-encapsulation in Java?',
		'What are wrapper classes in Java?',
		'What are constructors in Java?',
		'Why is Java not considered to be purely object-oriented?',
		'Does Java use pointers? If not, why?',
		'Can you override static methods in Java?',
		'What do you understand about ClassLoader in Java?'
	];

	const questions2 = questionsList2.map((question, index) => ({
		id: uuidv4(),
		interviewId: randomInterviewIds[1],
		slug: slugGenerator(question),
		question
	}));

	await db.insert(question).values(questions2);

	const questionsList3 = [
		'Can Laravel be used for Full Stack Development (Frontend + Backend)?',
		'Tell us about your prior experience as a remote Laravel developer.',
		'Have you ever faced any challenges while working in distributed teams?',
		'What kind of tools did you use for the remote role to stay connected?',
		'Do you find it difficult to focus on work as a remote developer?',
		'What is the latest version of Laravel?',
		'Mention the databases supported by Laravel.',
		'Explain what is composer in Laravel.',
		'What is maintenance mode in Laravel.',
		'What is a Route in Laravel?'
	];

	const questions3 = questionsList3.map((question, index) => ({
		id: uuidv4(),
		interviewId: randomInterviewIds[2],
		slug: slugGenerator(question),
		question
	}));

	await db.insert(question).values(questions3);
}

function slugGenerator(str: string) {
	return slugify(str, {
		lower: true,
		strict: true
	});
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
