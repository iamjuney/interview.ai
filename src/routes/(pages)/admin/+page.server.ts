import { db } from '$lib/db';
import { answer, user, userInterview, log, interview } from '$lib/db/schema';
import { and, avg, count, desc, eq, gte, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const currentYear = new Date().getFullYear();
	const month = new Date().getMonth();
	let averageAnswerDuration: number | null = 0;

	const newUsersThisMonth = await db
		.select({ count: count(user.createdAt) })
		.from(user)
		.where(and(gte(user.createdAt, new Date(currentYear, month, 1)), eq(user.role, 'user')));

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

	let totalActiveUsersEveryMonth = [];

	// Get active users for each month
	for (let i = 0; i < getPastTwelveMonths().length; i++) {
		const tempMonth = getPastTwelveMonths()[i];
		const nextMonth = getPastTwelveMonths()[i + 1] || new Date(currentYear + 1, 0, 1);

		const readbleTempMonth = tempMonth.toLocaleString('default', { month: 'long' });

		const activeUsers = await db
			.selectDistinctOn([log.userId])
			.from(log)
			.where(and(gte(log.createdAt, tempMonth), lt(log.createdAt, nextMonth)));

		totalActiveUsersEveryMonth.push({ id: i, month: readbleTempMonth, users: activeUsers.length });
	}

	// Get top job positions
	const topJobPositions = await db
		.select({ count: count(userInterview.id), position: interview.position })
		.from(userInterview)
		.leftJoin(interview, eq(userInterview.interviewId, interview.id))
		.groupBy(interview.position)
		.orderBy(desc(count(userInterview.id)))
		.limit(10);

	return {
		newUsersThisMonth: newUsersThisMonth[0].count,
		totalCompletedInterviews: totalCompletedInterviews[0].count,
		totalQuestionsAnswered: totalQuestionsAnswered.length,
		averageAnswerDuration: readableDuration(averageAnswerDuration),
		totalActiveUsersEveryMonth,
		topJobPositions
	};
}) as PageServerLoad;

const readableDuration = (duration: number) => {
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;
	return ((minutes ? minutes + ' m ' : '') + (seconds ? seconds + ' s' : '')).trim() || '0 s';
};

const getPastTwelveMonths = () => {
	const currentYear = new Date().getFullYear();
	const month = new Date().getMonth();
	const months = [];

	for (let i = 0; i < 12; i++) {
		months.push(new Date(currentYear, month - i, 1));
	}

	return months.reverse();
};
