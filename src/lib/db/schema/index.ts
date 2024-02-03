import {
	pgTable,
	bigint,
	varchar,
	timestamp,
	text,
	uniqueIndex,
	integer,
	json
} from 'drizzle-orm/pg-core';

export const user = pgTable(
	'users',
	{
		id: varchar('id', {
			length: 36 // uuid
		}).primaryKey(),
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
		createdAt: timestamp('createdAt').defaultNow().notNull()
	},
	(users) => {
		return {
			uniqueIdx: uniqueIndex('unique_idx').on(users.email)
		};
	}
);

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

export const interview = pgTable('interviews', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	title: varchar('title', {
		length: 255
	}).notNull(),
	description: text('description').notNull(),
	company: varchar('company', {
		length: 255
	}).notNull(),
	questions: varchar('questions', {
		length: 36
	})
		.notNull()
		.array(),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const question = pgTable('questions', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	question: text('question').notNull(),
	duration: integer('duration').notNull(),
	videoUrl: text('video_url').default(''),
	interviewId: varchar('interview_id', {
		length: 36
	})
		.notNull()
		.references(() => interview.id, { onDelete: 'cascade' }),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const answer = pgTable('answers', {
	id: varchar('id', {
		length: 36
	}).primaryKey(),
	answer: text('answer').notNull(),
	videoUrl: text('video_url').default(''),
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
	createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const assessment = pgTable('assessment', {
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
	feedback: text('feedback').notNull(),
	wpm: integer('wpm').notNull(),
	accuracy: integer('accuracy').notNull(),
	pronunciation: integer('pronunciation').notNull(),
	fluency: integer('fluency').notNull(),
	mispronunciation: integer('mispronunciation').notNull(),
	data: json('data').default({}),
	createdAt: timestamp('createdAt').defaultNow().notNull()
});
