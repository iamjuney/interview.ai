import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const POST: RequestHandler = async ({ request }) => {
	const { videoURl } = await request.json();

	// Ask OpenAI to transcribe the video
	const transcribeRes = await openai.audio.transcriptions.create({
		model: 'whisper-1',
		file: videoURl,
		response_format: 'text'
	});

	const transcript = transcribeRes.text;

	const moderationRes = await openai.moderations.create({
		input: transcript
	});

	if (moderationRes.results[0].flagged) {
		return json({ error: 'Inappropriate content detected. Please try again.' }, { status: 400 });
	}

	return json({ transcript }, { status: 200 });
};
