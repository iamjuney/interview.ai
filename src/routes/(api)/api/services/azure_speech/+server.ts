import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import _ from 'lodash';
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

	let mispronunciations = 0;

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

		let result = new sdk.SpeechRecognitionResult();

		await new Promise<void>((resolve) => {
			reco.recognizeOnceAsync((successfulResult: sdk.SpeechRecognitionResult) => {
				// onRecognizedResult(successfulResult);

				result = successfulResult;
				reco.close();
			});

			resolve();
		});

		const pronunciation_result = sdk.PronunciationAssessmentResult.fromResult(result);

		// count the number of mispronunciations
		_.forEach(pronunciation_result.detailResult.Words, (word) => {
			if (word.PronunciationAssessment?.ErrorType === 'Mispronunciation') {
				mispronunciations++;
			}
		});

		return json(
			{
				mispronunciations: mispronunciations,
				accuracyScore: pronunciation_result.accuracyScore,
				pronunciationScore: pronunciation_result.pronunciationScore,
				fluencyScore: pronunciation_result.fluencyScore,
				prosodyScore: pronunciation_result.prosodyScore,
				detailResult: pronunciation_result.detailResult.Words
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ error: 'An error occurred while assessing the pronunciation. Please try again.' },
			{ status: 500 }
		);
	}
};
