import { json } from '@sveltejs/kit';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { OpenAI } from 'openai';
import { OPENAI_API_KEY, OPENAI_API_ORG } from '$env/static/private';

export const config = {
	api: {
		bodyParser: false
	}
};

export async function POST({ request }) {
	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
		organization: OPENAI_API_ORG
	});

	// Here, we create a temporary file to store the audio file using Vercel's tmp directory
	// As we compressed the file and are limiting recordings to 2.5 minutes, we won't run into trouble with storage capacity
	const fData = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
		const form = new IncomingForm({
			multiples: false,
			uploadDir: '/tmp',
			keepExtensions: true
		});
		// @ts-expect-error
		form.parse(request, (err, fields, files) => {
			if (err) return reject(err);
			resolve({ fields, files });
		});
	});

	const videoFile = fData.files.file;
	const videoFilePath = videoFile?.filepath;
	console.log(videoFilePath);

	try {
		const resp = await openai.audio.transcriptions.create({
			file: fs.createReadStream(videoFilePath),
			model: 'whisper-1'
		});

		return json({ transcript: resp.text }, { status: 200 });
	} catch (error: any) {
		console.error('server error', error);
		return json({ error: error.message }, { status: 500 });
	}
}
