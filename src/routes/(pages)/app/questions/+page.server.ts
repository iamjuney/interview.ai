import { db } from '$lib/db';
import { answer } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    const session = await locals.auth.validate();
    const user = session!.user;

    const questions = await db.query.question.findMany({
        with: {
            answers: {
                where: eq(answer.userId, user.userId)
            }
        },
        // limit: 10
    });

    return {
        questions
    };
}) satisfies PageServerLoad;
