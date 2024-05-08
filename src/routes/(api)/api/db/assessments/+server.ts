import { db } from '$lib/db';
import { assessment, log } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const form = await request.json();

	try {
		await db.insert(assessment).values(form);
		await db.insert(log).values({
			id: uuidv4(),
			userId: userId,
			message: 'User saved assessment'
		});
	} catch (error) {
		return json({ error: 'Error saving assessments to database' }, { status: 400 });
	}

	return json({ message: 'Assessments saved successfully' }, { status: 200 });
};
