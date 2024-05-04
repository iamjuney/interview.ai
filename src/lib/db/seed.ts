import { auth } from '$lib/server/lucia';
import type { Question } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import interviews from './interviews.json';
import questions from './questions.json';
import { interview, question } from './schema';

async function seed() {
	await insertInterviews();
	await insertQuestions();
	await insertAdminUser();
}

async function insertAdminUser() {
	try {
		// this does two things:
		// 1. create a user in the database
		// 2. create a key in the database
		const user = await auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: 'dcst@vsu.edu.ph',
				// lucia gonna hash the password automatically for you and saved it in the collection of keys in the database
				password: 'password123'
			},
			// this is the user attributes we put into model of user, this data gonna be saved in the collection of users in the database
			attributes: {
				role: 'user',
				email: 'dcst@vsu.edu.ph',
				show_onboarding: false,

				// my custom fields
				first_name: 'Admin',
				last_name: 'Admin',
				image: ''
			}
		});

		console.log('Admin user inserted');
	} catch (e) {
		if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
			return fail(400, {
				message: 'User already exists'
			});
		}
	}
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
