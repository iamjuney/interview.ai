import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import type { DetailResult } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import _ from 'lodash';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const config = {
	runtime: 'edge'
};

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

		let accuracyScore = 0;
		let pronunciationScore = 0;
		let fluencyScore = 0;
		let prosodyScore = 0;
		let data: DetailResult[] = [];

		await new Promise((resolve, reject) => {
			reco.recognizeOnceAsync(
				(successfulResult) => {
					const result = sdk.PronunciationAssessmentResult.fromResult(successfulResult);

					accuracyScore = result.accuracyScore;
					pronunciationScore = result.pronunciationScore;
					fluencyScore = result.fluencyScore;
					prosodyScore = result.prosodyScore;

					// count the number of mispronunciations
					_.forEach(result.detailResult.Words, (word) => {
						data.push({
							word: word.Word,
							errorType: word.PronunciationAssessment?.ErrorType
						});
					});
					reco.close();
					resolve(successfulResult);
				},
				(error) => {
					reject(error);
				}
			);
		});

		return json(
			{
				accuracyScore,
				pronunciationScore,
				fluencyScore,
				prosodyScore,
				data
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
