import { relations } from 'drizzle-orm';
import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';

/** Enums */

export const statusEnum = pgEnum('status', ['in-progress', 'completed']);
export const difficultyEnum = pgEnum('difficulty', ['basic', 'Intermediate', 'Advanced']);

/** TABLES */

// user table
export const user = pgTable(
	'users',
	{
		id: varchar('id', {
			length: 36 // uuid
		}).primaryKey(),
		username: varchar('username', {
			length: 255
		}).unique(),
		first_name: varchar('first_name', {
			length: 50
		}).notNull(),
		last_name: varchar('last_name', {
			length: 50
		}).notNull(),
		email: varchar('email', {
			length: 255
		})
			.notNull()
			.unique(),
		image: text('image').default(''),
		showOnboarding: boolean('show_onboarding').default(true),
		createdAt: timestamp('createdAt').defaultNow()
	},
	(users) => {
		return {
			uniqueIdx: uniqueIndex('unique_idx').on(users.email)
		};
	}
);

// user_session table
export const session = pgTable('user_session', {
	id: varchar('id', {
		length: 128
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 36
	})
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
});

// user_key table
export const key = pgTable('user_key', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 36
	})
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	hashedPassword: varchar('hashed_password', {
		length: 255
	})
});

// interviews table
export const interview = pgTable('interviews', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	slug: varchar('slug', {
		length: 255
	})
		.notNull()
		.unique(),
	position: varchar('position', {
		length: 255
	}).notNull(),
	difficulty: difficultyEnum('difficulty').default('basic').notNull(),
	duration: integer('duration').default(0).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

// user_interviews table
export const userInterview = pgTable('user_interviews', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 36
	})
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	interviewId: varchar('interview_id', {
		length: 36
	})
		.notNull()
		.references(() => interview.id, { onDelete: 'cascade' }),
	status: statusEnum('status').default('in-progress').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

// questions table
export const question = pgTable('questions', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	interviewId: varchar('interview_id', {
		length: 36
	})
		.notNull()
		.references(() => interview.id, { onDelete: 'cascade' }),
	slug: varchar('slug', {
		length: 255
	})
		.notNull()
		.unique(),
	question: text('question').notNull()
});

// answers table
export const answer = pgTable('answers', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 36
	})
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	questionId: varchar('question_id', {
		length: 36
	})
		.notNull()
		.references(() => question.id, { onDelete: 'cascade' }),
	answer: text('answer').notNull(),
	duration: integer('duration').default(0).notNull(),
	videoUrl: text('video_url').default('').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

// assessment table
export const assessment = pgTable('assessments', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	answerId: varchar('answer_id', {
		length: 36
	})
		.notNull()
		.references(() => answer.id, { onDelete: 'cascade' }),
	feedback: text('feedback').notNull(),
	accuracy_score: real('accuracy').notNull(),
	pronunciation_score: real('pronunciation').notNull(),
	fluency_score: real('fluency').notNull(),
	prosody_score: real('prosody').notNull(),
	data: jsonb('data').default({})
});

/** Relations */
export const userRelation = relations(user, ({ many }) => ({
	interviews: many(userInterview),
	answers: many(answer)
}));

export const userInterviewRelation = relations(userInterview, ({ one }) => ({
	user: one(user, {
		fields: [userInterview.userId],
		references: [user.id]
	}),
	interview: one(interview, {
		fields: [userInterview.interviewId],
		references: [interview.id]
	})
}));

export const interviewRelation = relations(interview, ({ many }) => ({
	questions: many(question)
}));

export const questionRelation = relations(question, ({ one, many }) => ({
	interview: one(interview, {
		fields: [question.interviewId],
		references: [interview.id]
	}),
	answers: many(answer)
}));

export const answerRelation = relations(answer, ({ one }) => ({
	question: one(question, {
		fields: [answer.questionId],
		references: [question.id]
	}),
	user: one(user, {
		fields: [answer.userId],
		references: [user.id]
	}),
	assessment: one(assessment, {
		fields: [answer.id],
		references: [assessment.answerId]
	})
}));

export const assessmentRelation = relations(assessment, ({ one }) => ({
	answer: one(answer, {
		fields: [assessment.answerId],
		references: [answer.id]
	})
}));
