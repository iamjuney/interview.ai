import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const POST: RequestHandler = async ({ request }) => {
	// Get the video URL from the request
	const { videoUrl } = await request.json();

	// Ask OpenAI to transcribe the video
	const transcribeRes = await openai.audio.transcriptions.create({
		model: 'whisper-1',
		file: videoUrl,
		response_format: 'text'
	});

	const transcript = transcribeRes.text;

	const moderationRes = await openai.moderations.create({
		input: transcript
	});

	if (moderationRes.results[0].flagged) {
		return json({ message: 'Inappropriate content detected. Please try again.' }, { status: 200 });
	}

	return json({ transcript }, { status: 200 });
};
