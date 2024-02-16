import { OPENAI_API_KEY, OPENAI_API_ORG } from '$env/static/private';
import { json } from '@sveltejs/kit';
import axios from 'axios';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
	organization: OPENAI_API_ORG
});

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	let transcript = '';

	try {
		const transcribeRes = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			}
		});

		transcript = transcribeRes.data.text;

		const moderationRes = await openai.moderations.create({
			input: transcript
		});

		if (moderationRes.results[0].flagged) {
			return json({ error: 'Inappropriate content detected. Please try again.' }, { status: 400 });
		}

		return json({ transcript: transcript }, { status: 200 });
	} catch (error) {
		return json(
			{ error: 'An error occurred while transcribing the audio. Please try again.' },
			{ status: 400 }
		);
	}
};
