import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const POST = (async ({ request }) => {
	// Extract the `prompt` from the body of the request
	const { prompt } = await request.json();

	// Ask OpenAI for a streaming chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: [
			{
				role: 'system',
				content:
					"You are a tech hiring manager. You are to only provide feedback on the interview candidate's transcript. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the candidate's response."
			},
			{ role: 'user', content: prompt }
		]
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);
	// Respond with the stream
	return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
