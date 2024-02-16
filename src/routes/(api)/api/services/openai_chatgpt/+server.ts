import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const POST = (async ({ request }) => {
	const { prompt } = await request.json();

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-0125',
			stream: false,
			messages: [
				{
					role: 'system',
					content:
						"You are a tech hiring manager. You are to only provide feedback on the interview candidate's transcript. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the candidate's response."
				},
				{ role: 'user', content: prompt }
			]
		});

		// Return the response from OpenAI
		return json({ feedback: response.choices[0].message.content }, { status: 200 });
	} catch (error) {
		return json(
			{ error: 'An error occurred while processing the request. Please try again.' },
			{ status: 400 }
		);
	}
}) satisfies RequestHandler;
