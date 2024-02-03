import { v4 as uuidv4 } from 'uuid';
import { interview, question } from './schema';
import { db } from './index';

const randomInterviewId = uuidv4();

async function seed() {
	await insertInterviews();
	await insertQuestions();
}

async function insertInterviews() {
	const interviews = [
		{
			id: randomInterviewId,
			slug: 'intern-react-developer',
			position: 'Intern React Developer',
			description:
				'An Intern React Developer is responsible for developing web applications using React.js. They will work with other developers and product managers throughout the software development life cycle.'
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
		interviewId: randomInterviewId,
		slug: `question-${index + 1}`,
		question
	}));

	await db.insert(question).values(questions);
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
