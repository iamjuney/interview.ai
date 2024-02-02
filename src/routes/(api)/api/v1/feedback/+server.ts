// import { OpenAIStream, type OpenAIStreamPayload } from '$lib/utils/OpenAIStream';
// import { json } from '@sveltejs/kit';
// import { OPENAI_API_KEY } from '$env/static/private';

// export const config = {
// 	runtime: 'edge'
// };

// export async function GET({ request }) {
// 	const { prompt } = await request.json();

// 	if (!prompt) {
// 		return json({ error: 'No prompt in the request' }, { status: 400 });
// 	}

// 	const payload: OpenAIStreamPayload = {
// 		model: 'gpt-3.5-turbo',
// 		messages: [
// 			{
// 				role: 'system',
// 				content:
// 					"You are a tech hiring manager. You are to only provide feedback on the interview candidate's transcript. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the candidate's response."
// 			},
// 			{ role: 'user', content: prompt }
// 		],
// 		temperature: 0.7,
// 		top_p: 1,
// 		frequency_penalty: 0,
// 		presence_penalty: 0,
// 		max_tokens: 450,
// 		stream: true,
// 		n: 1
// 	};

// 	const stream = await OpenAIStream(payload);
// 	return json(stream);
// }
