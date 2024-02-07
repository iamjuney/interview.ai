import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechConfig = sdk.SpeechConfig.fromSubscription(
	AZURE_SUBSCRIPTION_KEY,
	AZURE_SERVICE_REGION
);

export const config = {
	runtime: 'edge'
};

export const GET: RequestHandler = async ({ request }) => {
	// Get the video URL from the request
	const { audioUrl, transcript, duration } = await request.json();

	const audioConfig = sdk.AudioConfig.fromWavFileInput(audioUrl);
	const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
		transcript,
		sdk.PronunciationAssessmentGradingSystem.HundredMark,
		sdk.PronunciationAssessmentGranularity.Phoneme,
		true
	);
	const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
	pronunciationAssessmentConfig.applyTo(recognizer);

	const assessmentRes = recognizer.recognizeOnceAsync((successfulResult) => {
		const result = successfulResult.properties.getProperty(
			sdk.PropertyId.SpeechServiceResponse_JsonResult
		);

		if (result) {
			return result;
		}
	});

	recognizer.close();

	// calculate the wpm
	const words = transcript.split(' ').length;
	const wpm = Math.round(words / (duration / 60));

	return json(
		{
			assessment: assessmentRes,
			wpm
		},
		{ status: 200 }
	);
};
