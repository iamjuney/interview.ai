import { db } from '$lib/db';
import { assessment } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.json();

	try {
		await db.insert(assessment).values(form);
	} catch (error) {
		return json({ error: 'Error saving assessments to database' }, { status: 400 });
	}

	return json({ message: 'Assessments saved successfully' }, { status: 200 });
};
