import { AZURE_SERVICE_REGION, AZURE_SUBSCRIPTION_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const config = {
	runtime: 'edge'
};

/**
 * Configuration for the Azure Speech API server.
 */
const speechConfig = sdk.SpeechConfig.fromSubscription(
	AZURE_SUBSCRIPTION_KEY,
	AZURE_SERVICE_REGION
);

/**
 * Handles the POST request to the Azure Speech API server.
 * @param request - The incoming request object.
 * @returns The response object containing the assessment scores and data.
 */
export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData(); // Parse the incoming form data
	const audioUrl = form.get('file') as File; // Get the audio file
	const transcript = form.get('transcript') as string; // Get the transcript

	// Convert the audio file to a buffer
	const wavData = Buffer.from(await audioUrl.arrayBuffer());

	try {
		const audioConfig = sdk.AudioConfig.fromWavFileInput(wavData); // Create an audio configuration

		// Create a pronunciation assessment configuration
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

		// Recognize the audio and get the pronunciation assessment result
		let newResult = await new Promise((resolve) => {
			reco.recognizeOnceAsync((result) => {
				resolve(result);
				reco.close();
			});
		});

		// Create a pronunciation assessment result from the result
		const pronunciationAssessmentResult = sdk.PronunciationAssessmentResult.fromResult(
			newResult as any
		);

		// Return the assessment scores and data
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
