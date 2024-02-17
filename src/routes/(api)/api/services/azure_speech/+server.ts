import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const config = {
	runtime: 'edge'
};

const speechConfig = sdk.SpeechConfig.fromSubscription(
	AZURE_SUBSCRIPTION_KEY,
	AZURE_SERVICE_REGION
);

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const audioUrl = form.get('file') as File;
	const transcript = form.get('transcript') as string;

	const wavData = Buffer.from(await audioUrl.arrayBuffer());

	try {
		const audioConfig = sdk.AudioConfig.fromWavFileInput(wavData);
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

		const pronunciationAssessmentResult = sdk.PronunciationAssessmentResult.fromResult(
			newResult as any
		);

		return json(
			{
				scores: pronunciationAssessmentResult.detailResult.PronunciationAssessment,
				data: pronunciationAssessmentResult.detailResult.Words
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'An error occurred while assessing the pronunciation. Please try again.' },
			{ status: 400 }
		);
	}
};
