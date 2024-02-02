import { pgTable, bigint, varchar, timestamp, text, uniqueIndex } from 'drizzle-orm/pg-core';

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
