import { db } from '$lib/db';
import { answer, user, userInterview, log } from '$lib/db/schema';
import { and, avg, count, eq, gte, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const year = new Date().getFullYear();
	const month = new Date().getMonth();
	let averageAnswerDuration: number | null = 0;

	const newUsersThisMonth = await db
		.select({ count: count(user.createdAt) })
		.from(user)
		.where(and(gte(user.createdAt, new Date(year, month, 1)), eq(user.role, 'user')));

	const totalCompletedInterviews = await db
		.select({ count: count(userInterview.id) })
		.from(userInterview)
		.where(eq(userInterview.status, 'completed'));

	const totalQuestionsAnswered = await db
		.selectDistinctOn([answer.userId, answer.questionId])
		.from(answer);

	const averageAnswerDurationQuery = await db.select({ value: avg(answer.duration) }).from(answer);

	if (averageAnswerDurationQuery[0].value) {
		averageAnswerDuration = parseInt(averageAnswerDurationQuery[0].value);
	}

	let totalActiveUsers = 0;
	// get active users each month
	for (let i = 0; i < 12; i++) {
		const tempMonth = new Date(year, i, 1);
		const nextMonth = new Date(year, i + 1, 1);

		const activeUsers = await db
			.selectDistinctOn([log.userId])
			.from(log)
			.where(and(gte(log.createdAt, tempMonth), lt(log.createdAt, nextMonth)));

		console.log(activeUsers.length);
	}

	return {
		newUsersThisMonth: newUsersThisMonth[0].count,
		totalCompletedInterviews: totalCompletedInterviews[0].count,
		totalQuestionsAnswered: totalQuestionsAnswered.length,
		averageAnswerDuration: readableDuration(averageAnswerDuration)
	};
}) as PageServerLoad;

const readableDuration = (duration: number) => {
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;
	return ((minutes ? minutes + ' m ' : '') + (seconds ? seconds + ' s' : '')).trim() || '0 s';
};
