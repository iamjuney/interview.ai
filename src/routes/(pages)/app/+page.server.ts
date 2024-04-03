import { db } from '$lib/db';
import { answer, interview, userInterview } from '$lib/db/schema';
import type { Answer, Interview } from '$lib/types';
import { error } from '@sveltejs/kit';
import { eq, notInArray, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Function to convert the duration of the answers to a readable format
function readableDuration(duration: number) {
	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration % 3600) / 60);
	return (
		`${hours ? `${hours} hour(s)` : ''} ${minutes ? `${minutes} min(s)` : ''}`.trim() || '0 min(s)'
	);
}

// Function to calculate the daily streak (eg. 5 days)
function calculateDailyStreak(answers: Answer[]) {
	// return if the user has not answered any questions
	if (answers.length === 0) {
		return 0;
	}

	// get all the dates of the answers
	const dates = [];
	for (let i = 0; i < answers.length; i++) {
		dates.push(new Date(answers[i].createdAt).toDateString());
	}

	// get the unique dates
	const uniqueDates = [...new Set(dates)];

	// sort the unique dates
	uniqueDates.sort();

	// get the current date
	const currentDate = new Date().toDateString();

	// get the last date
	const lastDate = new Date(answers[answers.length - 1].createdAt).toDateString();

	// check if the user has answered today
	const answeredToday = currentDate === lastDate;

	if (!answeredToday) {
		return 0;
	}

	// loop through the unique dates from current date decreasingly and check if the user has answered on each day and count
	let streak = 0;
	for (let i = uniqueDates.length - 1; i >= 0; i--) {
		if (uniqueDates[i] === currentDate) {
			streak++;
		} else {
			break;
		}
	}

	return streak;
}

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;
	const showOnboarding = session?.user.show_onboarding;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	// Get count of completed interviews
	const userInterviews = await db.query.userInterview.findMany({
		where: eq(userInterview.userId, userId)
	});

	if (userInterviews.length === 0) {
		const suggestedInterviews = await db.query.interview.findMany({
			with: {
				questions: true
			},
			limit: 3,
			orderBy: sql`RANDOM()`
		});

		return {
			suggestedInterviews: suggestedInterviews as Interview[],
			completed: 0,
			interviewTime: '0 min(s)',
			dailyStreak: 0
		};
	}

	// loop through the user interviews and get the completed ones
	let completed = 0;
	for (let i = 0; i < userInterviews.length; i++) {
		if (userInterviews[i].status === 'completed') {
			completed++;
		}
	}

	// This is a query to the database to get a random interview with its questions
	const suggestedInterviews = (await db.query.interview.findMany({
		where: notInArray(
			interview.id,
			userInterviews.map((ui) => ui.interviewId)
		),
		with: {
			questions: true
		},
		limit: 3,
		orderBy: sql`RANDOM()`
	})) as Interview[];

	// Get the duration of the answers
	const answers = (await db.query.answer.findMany({
		columns: {
			duration: true,
			createdAt: true
		},
		with: {
			assessment: true
		},
		where: eq(answer.userId, userId)
	})) as Answer[];

	// Calculate the total duration of the answers
	const totalDuration = answers.reduce((acc, answer) => acc + answer.duration, 0);
	const interviewTime = readableDuration(totalDuration);

	// Calculate the daily streak
	const dailyStreak = calculateDailyStreak(answers);

	return {
		suggestedInterviews,
		completed,
		interviewTime,
		dailyStreak,
		showOnboarding
	};
}) satisfies PageServerLoad;
