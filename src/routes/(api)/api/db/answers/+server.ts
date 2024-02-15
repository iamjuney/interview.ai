import { db } from '$lib/db';
import { answer } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.json();

	try {
		await db.insert(answer).values(form);
	} catch (error) {
		return json({ error: 'Error saving answers to database' }, { status: 400 });
	}

	return json({ message: 'Answers saved successfully' }, { status: 200 });
};
