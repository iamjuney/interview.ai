import { db } from '$lib/db';
import { assessment } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from 'drizzle-orm';

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	const {
		id,
		answerId,
		feedback,
		accuracy_score,
		pronunciation_score,
		fluency_score,
		prosody_score,
		data
	} = await request.json();

	try {
		await db.insert(assessment).values({
			id: id,
			answerId: answerId,
			feedback: feedback,
			accuracy_score: accuracy_score,
			pronunciation_score: pronunciation_score,
			fluency_score: fluency_score,
			prosody_score: prosody_score,
			data: sql`${data}::jsonb`
		});
	} catch (error) {
		return json({ error: 'Error saving assessments to database' }, { status: 400 });
	}

	return json({ message: 'Assessments saved successfully' }, { status: 200 });
};
