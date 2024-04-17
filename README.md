# AI-Driven Job Interview Practice Platform

## Abstract:

### This repository contains the source code for an AI-driven job interview practice platform, developed for my thesis research.

## Tech Stack:

- Framework: SvelteKit
- UI: Shadcn UI
- Deployment: Vercel
- Database: Postgres
- Speech Recognition: Azure Speech Services

## Features:

1. Practice common and job-specific interview questions
2. Receive AI-powered feedback on responses (e.g., speech clarity, structure, keywords)
3. Analyze performance metrics (e.g., word count, speaking rate); and more.

## Setting Up:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in the required environment variables
4. Push the database schema: `pnpm run db:push`
5. Seed the database: `pnpm run db:seed`
6. Start the development server: `pnpm dev`
