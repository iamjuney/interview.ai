import type { Question } from '$lib/types';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import interviews from './interviews.json';
import questions from './questions.json';
import { interview, key, question, user } from './schema';

async function seed() {
	await insertAdminUser();
	await insertInterviews();
	await insertQuestions();
}

async function insertAdminUser() {
	const adminID = uuidv4();
	await db.insert(user).values({
		id: adminID,
		email: 'dcst@vsu.edu.ph',
		role: 'admin',
		show_onboarding: false,
		first_name: 'Admin',
		last_name: 'Admin',
		image: ''
	});
	console.log('Admin user inserted');
	await db.insert(key).values({
		id: 'email:dcst@vsu.edu.ph',
		userId: adminID,
		hashedPassword:
			's2:j6iquv3dc6wzg85g:5e71d3f4b5f90f5d14d88f072291a82b8cab93509a4d22f66a6abf1cfb30d778e9ad95680db08a4b656edaa64d0b3a26eb426f70b4eb0dc31707ace651d78769'
	});
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
				slug: slugGenerator(q[j].question),
				question: q[j].question,
				videoUrl: q[j].video_url
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
