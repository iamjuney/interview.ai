import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import type { DetailResult } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechConfig = sdk.SpeechConfig.fromSubscription(
	AZURE_SUBSCRIPTION_KEY,
	AZURE_SERVICE_REGION
);

async function writeWavFileAsync(filename: string, buffer: ArrayBuffer) {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(filename, Buffer.from(buffer), (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const audioUrl = form.get('file') as File;
	const transcript = form.get('transcript') as string;

	const wavData = Buffer.from(await audioUrl.arrayBuffer());

	// use the tmp serverless function folder to create the write stream for the audio file
	const filePath = `/tmp/${audioUrl.name}`;
	await writeWavFileAsync(filePath, wavData);

	try {
		const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(`/tmp/${audioUrl.name}`));
		const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
			transcript,
			sdk.PronunciationAssessmentGradingSystem.HundredMark,
			sdk.PronunciationAssessmentGranularity.Phoneme,
			true
		);

		pronunciationAssessmentConfig.enableProsodyAssessment = true;

		// setting the recognition language to English.
		speechConfig.speechRecognitionLanguage = 'en-US';

		const reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
		pronunciationAssessmentConfig.applyTo(reco);

		let newResult = await new Promise((resolve) => {
			reco.recognizeOnceAsync((result) => {
				resolve(result);
				reco.close();
			});
		});

		// close the recognizer

		const pronunciationAssessmentResult = sdk.PronunciationAssessmentResult.fromResult(
			newResult as any
		);

		// const accuracyScore = pronunciationAssessmentResult.accuracyScore;
		// const pronunciationScore = pronunciationAssessmentResult.pronunciationScore;
		// const fluencyScore = pronunciationAssessmentResult.fluencyScore;
		// const prosodyScore = pronunciationAssessmentResult.prosodyScore;
		// let data: DetailResult[] = [];

		// var words = pronunciationAssessmentResult.detailResult.Words;
		// for (var i = 0; i < words.length; i++) {
		// 	var word = words[i];
		// 	data.push({
		// 		word: word.Word,
		// 		errorType: word.PronunciationAssessment?.ErrorType
		// 	});
		// }

		// return json(
		// 	{
		// 		accuracyScore,
		// 		pronunciationScore,
		// 		fluencyScore,
		// 		prosodyScore,
		// 		data
		// 	},
		// 	{ status: 200 }
		// );
		return json(
			{
				scores: pronunciationAssessmentResult.detailResult.PronunciationAssessment,
				data: pronunciationAssessmentResult.detailResult.Words
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ error: 'An error occurred while assessing the pronunciation. Please try again.' },
			{ status: 400 }
		);
	}
};
