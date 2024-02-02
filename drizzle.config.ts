import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
	path: '.env.local'
});

export default {
	schema: './src/lib/db/schema',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		host: process.env.POSTGRES_HOST ?? 'default-host',
		port: 5432,
		database: process.env.POSTGRES_DATABASE ?? 'verceldb',
		ssl: true
	}
} satisfies Config;
