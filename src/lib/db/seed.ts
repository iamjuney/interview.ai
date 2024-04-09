import { db } from './index';
import { interview, question } from './schema';
import interviews from './interviews.json';
import questions from './questions.json';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import type { Question } from '$lib/types';

async function seed() {
	await insertInterviews();
	await insertQuestions();
}

async function insertInterviews() {
	await db.insert(interview).values(interviews);
	console.log('Interviews inserted');
}

async function insertQuestions() {
	for (let i = 0; i < questions.length; i++) {
		const q = questions[i].questions;
		let list: Question[] = [];

		for (let j = 0; j < q.length; j++) {
			const data: Question = {
				id: uuidv4(),
				interviewId: interviews[i].id,
				slug: slugGenerator(q[j]),
				question: q[j]
			};

			list.push(data);
		}

		await db.insert(question).values(list);
	}

	console.log('Questions inserted');
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
