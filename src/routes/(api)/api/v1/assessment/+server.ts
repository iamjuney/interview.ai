import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const config = {
	api: {
		bodyParser: false
	}
};

export async function POST({ request }) {
	try {
		var speechConfig = sdk.SpeechConfig.fromSubscription(
			AZURE_SUBSCRIPTION_KEY,
			AZURE_SERVICE_REGION
		);

		speechConfig.speechRecognitionLanguage = 'en-US';

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

		const audioFile = fData.files.file;
		const audioFilePath = audioFile?.filepath;
		console.log(audioFilePath);

		var audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFilePath));

		const reference_text = fData.fields.transcript;
		console.log(reference_text);

		// calculate the words per minute
		const words = reference_text.split(' ');
		const wordCount = words.length;
		const duration = audioFile.size / 32000;
		const wpm = Math.round(wordCount / duration);

		var pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
			reference_text,
			sdk.PronunciationAssessmentGradingSystem.HundredMark,
			sdk.PronunciationAssessmentGranularity.Phoneme,
			true
		);

		var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
		pronunciationAssessmentConfig.applyTo(recognizer);

		let pronunciationAssessmentJson: any;

		// Use await to wait for the recognition to complete
		await new Promise<void>((resolve, reject) => {
			recognizer.recognizeOnceAsync(
				(successfulResult: any) => {
					pronunciationAssessmentJson = successfulResult.properties.getProperty(
						sdk.PropertyId.SpeechServiceResponse_JsonResult
					);

					if (pronunciationAssessmentJson) {
						console.log('Pronunciation Assessment JSON:', pronunciationAssessmentJson);
						pronunciationAssessmentJson = JSON.parse(pronunciationAssessmentJson);
					} else {
						console.log('Pronunciation Assessment JSON is undefined.');
					}

					// Resolve the promise when recognition is done
					resolve();
				},
				(error: any) => {
					reject(error);
				}
			);
		});

		recognizer.close();

		// Add the words per minute to the pronunciation assessment result
		pronunciationAssessmentJson.WPM = wpm;

		return json({ pronunciationAssessmentJson }, { status: 200 });
	} catch (error: any) {
		console.error('server error', error);
		return json({ error: error.message }, { status: 500 });
	}
}
