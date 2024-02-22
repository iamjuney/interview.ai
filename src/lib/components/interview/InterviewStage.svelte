<script lang="ts">
	import { Button, Progress, Tooltip } from '$lib/components';
	import type { DetailResult, PronunciationAssessmentResult, Question } from '$lib/types';
	import { getWPM } from '$lib/utils';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { fetchFile, toBlobURL } from '@ffmpeg/util';
	import type { User } from 'lucia';
	import { AlertTriangle, ArrowRight, HelpCircle, Loader2, RefreshCw } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import DoughnutChart from './DoughnutChart.svelte';

	let { question, user } = $props<{ question: Question; user: User }>();
	const uniqueId = uuidv4();

	let ffmpeg = $state(new FFmpeg());
	let countdown = $state(150);
	let screenStream = $state<MediaStream>();
	let audioStream = $state<MediaStream>();
	let recordStream = $state<MediaStream>();
	let videoRef = $state<HTMLVideoElement>();
	let audioRecorderRef = $state<MediaRecorder>();
	let mediaRecorderRef = $state<MediaRecorder>();
	let audioChunks = $state<Blob[]>([]);
	let recordedChunks = $state<Blob[]>([]);
	let cameraLoading = $state(true);
	let cameraLoaded = $state(true);
	let cameraRecording = $state(false);
	let isSubmitting = $state(false);
	let status = $state('');
	let completed = $state(false);
	let errorMessage = $state('');

	let videoFile = $state<File>();
	let audioFile = $state<File>();
	let transcript = $state('');
	let generatedFeedback = $state('');
	let duration = $state(0);
	let assessmentData = $state<PronunciationAssessmentResult>();

	// handles the camera stream
	$effect(() => {
		untrack(async () => {
			await getStream();
			await loadFFmpeg();
		});

		return () => {
			stopStream();
		};
	});

	// handles the countdown timer
	$effect(() => {
		let timer: any = null;
		if (cameraRecording) {
			timer = setInterval(() => {
				countdown--;
			}, 1000);
			if (countdown === 0) handleStopCaptureClick();
		}

		return () => {
			clearInterval(timer);
		};
	});

	// function to get the camera stream
	async function getStream() {
		try {
			cameraLoading = true;
			screenStream = await navigator.mediaDevices.getUserMedia({
				video: true
			});

			audioStream = await navigator.mediaDevices.getUserMedia({
				audio: true
			});

			recordStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});

			if (videoRef) {
				videoRef.srcObject = screenStream;
			}

			cameraLoading = false;
		} catch (err) {
			cameraLoaded = false;
		}
	}

	// function to stop the camera stream
	function stopStream() {
		if (screenStream && audioStream && recordStream) {
			screenStream.getTracks().forEach((track) => {
				track.stop();
			});
			audioStream.getTracks().forEach((track) => {
				track.stop();
			});
			recordStream.getTracks().forEach((track) => {
				track.stop();
			});
			if (videoRef) videoRef.srcObject = null;
		}
	}

	// function to load ffmpeg
	async function loadFFmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
		});
	}

	async function convertToWav(file: File) {
		await ffmpeg.writeFile('input.webm', await fetchFile(file));
		await ffmpeg.exec([
			'-i',
			'input.webm',
			'-c:a',
			'pcm_s16le',
			'-ar',
			'16000',
			'-ac',
			'1',
			'output.wav'
		]);

		const data = (await ffmpeg.readFile('output.wav')) as Uint8Array;
		return new File([data.buffer], 'output.wav', { type: 'audio/wav' });
	}

	// function to handle the start of the recording
	function handleStartCaptureClick() {
		cameraRecording = true;

		audioRecorderRef = new MediaRecorder(audioStream!);
		mediaRecorderRef = new MediaRecorder(recordStream!);

		audioRecorderRef.ondataavailable = (e) => {
			audioChunks.push(e.data);
		};

		mediaRecorderRef.ondataavailable = (e) => {
			recordedChunks.push(e.data);
		};

		audioRecorderRef.start();
		mediaRecorderRef.start();
	}

	// function to handle the stop of the recording
	function handleStopCaptureClick() {
		audioRecorderRef?.stop();
		mediaRecorderRef?.stop();

		cameraRecording = false;
	}

	// function to handle the restart of the recording
	function handleRestartClick() {
		audioChunks = [];
		recordedChunks = [];
		countdown = 150;
	}

	// function to handle the processing of the recording
	async function convertProcess() {
		const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
		const recordBlob = new Blob(recordedChunks, { type: 'video/webm' });

		// create files from the blobs
		audioFile = new File([audioBlob], `${uniqueId}.webm`, { type: 'audio/webm' });
		videoFile = new File([recordBlob], `video.webm`, { type: 'video/webm' });
	}

	// function to handle the processing of the recording
	async function transcribeProcess() {
		const form = new FormData();

		if (audioFile) {
			form.append('file', audioFile, audioFile.name);
			form.append('model', 'whisper-1');
		}

		const upload = await fetch('/api/services/openai_whisper', {
			method: 'POST',
			body: form
		});

		const results = await upload.json();

		// set the status to error if the upload status is not 200
		if (upload.status !== 200) {
			isSubmitting = false;
			errorMessage = results.error;
			audioChunks = [];
			recordedChunks = [];
			return;
		}

		transcript = results.transcript;
	}

	// function to handle the processing of the recording
	async function feedbackProcess() {
		const prompt = `Please give feedback on the following interview question: ${question.question} given the following transcript: ${transcript}`;

		const upload = await fetch(`/api/services/openai_chatgpt`, {
			method: 'POST',
			body: JSON.stringify({ prompt }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const results = await upload.json();

		// set the status to error if the upload status is not 200
		if (upload.status !== 200) {
			isSubmitting = false;
			errorMessage = results.error;
			audioChunks = [];
			recordedChunks = [];
			return;
		}

		generatedFeedback = results.feedback;
	}

	// function to handle the processing of the recording
	async function assessmentProcess() {
		const wavFile = await convertToWav(audioFile!);

		const form = new FormData();

		form.append('file', wavFile, wavFile.name);
		form.append('transcript', transcript);

		const upload = await fetch(`/api/services/azure_speech`, {
			method: 'POST',
			body: form
		});

		const results = await upload.json();

		// set the status to error if the upload status is not 200
		if (upload.status !== 200) {
			isSubmitting = false;
			errorMessage = results.error;
			audioChunks = [];
			recordedChunks = [];
			return;
		}

		const accuracyScore = results.scores.AccuracyScore;
		const pronunciationScore = results.scores.PronScore;
		const fluencyScore = results.scores.FluencyScore;
		const prosodyScore = results.scores.ProsodyScore;
		let data: DetailResult[] = [];

		let words = results.data;
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			data.push({
				word: word.Word,
				errorType: word.PronunciationAssessment?.ErrorType
			});
		}

		assessmentData = {
			accuracyScore,
			pronunciationScore,
			fluencyScore,
			prosodyScore,
			data
		};
	}

	// function to handle the processing of the recording
	async function uploadVideo() {
		if (!videoFile) return;

		const form = new FormData();
		form.append('file', videoFile, videoFile.name);
		form.append('type', 'video');

		const response = await fetch('/api/services/cloudinary', {
			method: 'POST',
			body: form
		});
		const public_id = await response.json();

		return public_id;
	}

	async function uploadAnswer(newAnswerID: string) {
		const videoURL = await uploadVideo();
		duration = 150 - countdown;

		const upload = await fetch('/api/db/answers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: newAnswerID,
				userId: user.userId,
				questionId: question.id,
				answer: transcript,
				duration: duration,
				videoUrl: videoURL
			})
		});

		const response = await upload.json();

		if (response.status !== 200) {
			isSubmitting = false;
			errorMessage = response.error;
			audioChunks = [];
			recordedChunks = [];
			return;
		}
	}

	async function uploadAssessment(newAnswerID: string) {
		const upload = await fetch('/api/db/assessments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: uuidv4(),
				answerId: newAnswerID,
				feedback: generatedFeedback,
				accuracy_score: assessmentData?.accuracyScore,
				pronunciation_score: assessmentData?.pronunciationScore,
				fluency_score: assessmentData?.fluencyScore,
				prosody_score: assessmentData?.prosodyScore,
				data: assessmentData?.data
			})
		});

		const response = await upload.json();

		if (response.status !== 200) {
			isSubmitting = false;
			errorMessage = response.error;
			audioChunks = [];
			recordedChunks = [];
			return;
		}
	}

	// function to handle the processing of the recording
	async function handleProcessClick() {
		if (audioChunks.length && recordedChunks.length) {
			isSubmitting = true;

			// set the status to converting
			status = 'Converting';
			await convertProcess();

			// set the status to transcribing
			status = 'Transcribing';
			await transcribeProcess();

			// set the status to assessing
			status = 'Generating Feedback';
			await Promise.all([feedbackProcess(), assessmentProcess()]);

			const newAnswerID = uuidv4();
			// set the status to uploading
			status = 'Saving';
			await uploadAnswer(newAnswerID);
			await uploadAssessment(newAnswerID);

			// set the status to completed
			status = 'Completed';

			isSubmitting = false;
			completed = true;
			stopStream();
		}
	}
</script>

{#if cameraLoaded}
	<div
		class="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden rounded-lg bg-muted shadow-md ring-1 ring-gray-900/5"
		style="transform: none;"
	>
		<div class="relative z-10 h-full w-full rounded-lg">
			{#if completed}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					controls
					class="absolute z-10 h-full w-full object-cover"
					src={videoFile ? URL.createObjectURL(videoFile) : ''}
				>
				</video>
			{:else}
				<div class="absolute left-5 top-5 z-20 lg:left-10 lg:top-10">
					<span
						class="inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-sm font-medium text-primary-foreground"
						>{new Date(countdown * 1000).toISOString().slice(14, 19)}</span
					>
				</div>
				{#if cameraLoading}
					<div class="absolute z-10 grid h-full w-full place-content-center">
						<Loader2 class="size-6 animate-spin text-muted-foreground" />
					</div>
				{/if}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					bind:this={videoRef}
					autoplay
					playsinline
					class="absolute z-10 h-full w-full -scale-x-100 object-cover"
				>
				</video>
			{/if}
		</div>
		<div class="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
			<div class="absolute bottom-[6px] left-5 right-5 md:bottom-5">
				<div class="flex flex-col items-center justify-center gap-2 lg:mt-4">
					{#if !completed}
						{#if recordedChunks.length > 0}
							<div class="flex flex-row gap-2">
								{#if isSubmitting}
									<Button variant="secondary">
										{status}
										<Loader2 class="ml-2 size-4 animate-spin" />
									</Button>
								{:else}
									<Button onclick={handleRestartClick}>Restart</Button>
									<Button onclick={handleProcessClick} class="group" variant="secondary">
										Process Transcript
										<ArrowRight class="ml-2 size-4 transition group-hover:translate-x-2" />
									</Button>
								{/if}
							</div>
						{:else if cameraRecording}
							<button
								onclick={handleStopCaptureClick}
								class="flex size-10 scale-100 cursor-pointer flex-col items-center justify-center rounded-full bg-transparent text-white ring-4 ring-white duration-75 hover:shadow-xl active:scale-95"
							>
								<div class="size-5 cursor-pointer rounded bg-red-500"></div>
							</button>
						{:else}
							<button
								onclick={handleStartCaptureClick}
								class="flex size-8 scale-100 flex-col items-center justify-center rounded-full bg-red-500 ring-4 ring-white ring-offset-2 ring-offset-gray-500 duration-75 hover:shadow-xl active:scale-95 sm:h-8 sm:w-8"
							></button>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
	<!-- <div class="mt-4 flex flex-row items-center space-x-1" style="opacity: 1; transform: none;">
		<ShieldQuestion class="size-4 text-muted-foreground" />
		<p class="text-sm font-normal leading-[20px]">
			Video is not stored on our servers, it is solely used for transcription.
		</p>
	</div> -->
	{#if errorMessage}
		<div class="mt-4 flex flex-row items-center space-x-1" style="opacity: 1; transform: none;">
			<AlertTriangle class="size-4 text-red-500" />
			<p class="text-sm font-normal leading-[20px] text-red-500">{errorMessage}</p>
		</div>
	{/if}

	{#if completed}
		<div class="mt-12 flex max-w-[1080px] flex-col gap-12">
			<div class="mx-auto flex w-full max-w-2xl flex-col md:flex-row md:space-x-12">
				<div class="flex flex-none flex-col">
					<h2 class="mb-3 text-left text-lg font-semibold">
						Pronunciation Score
						<Tooltip.Root>
							<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
							<Tooltip.Content class="max-w-sm">
								<p>
									Overall score indicating the pronunciation quality of the given speech. This is
									aggregated from AccuracyScore, FluencyScore, and ProsodyScore.
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</h2>
					<DoughnutChart score={assessmentData!.pronunciationScore} />
				</div>

				<div class="mt-12 grow md:mt-0">
					<h2 class="text-lg font-semibold">Score breakdown</h2>
					<div class="mt-3 flex flex-col space-y-6 text-sm font-medium">
						<div class="flex flex-col gap-1">
							<p class="flex items-center justify-between">
								<span>
									Accuracy score
									<Tooltip.Root>
										<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
										<Tooltip.Content class="max-w-sm">
											<p>
												Accuracy indicates how closely the phonemes match a native speaker's
												pronunciation. Word and full text accuracy scores are aggregated from
												phoneme-level accuracy score.
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</span>

								<span> {assessmentData?.accuracyScore} / 100</span>
							</p>
							<Progress class="w-full bg-gray-200" value={assessmentData?.accuracyScore} />
						</div>
						<div class="flex flex-col gap-1">
							<p class="flex items-center justify-between">
								<span>
									Fluency score
									<Tooltip.Root>
										<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
										<Tooltip.Content class="max-w-sm">
											<p>
												Fluency indicates how closely the speech matches a native speaker's use of
												silent breaks between words.
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</span>
								<span> {assessmentData?.fluencyScore} / 100</span>
							</p>
							<Progress class="w-full bg-gray-200" value={assessmentData?.fluencyScore} />
						</div>
						<div class="flex flex-col gap-1">
							<p class="flex items-center justify-between">
								<span>
									Prosody score
									<Tooltip.Root>
										<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
										<Tooltip.Content class="max-w-sm">
											<p>
												Prosody indicates how nature of the given speech, including stress,
												intonation, speaking speed and rhythm.
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</span>
								<span> {assessmentData?.prosodyScore} / 100</span>
							</p>
							<Progress class="w-full bg-gray-200" value={assessmentData?.prosodyScore} />
						</div>
						<div class="flex flex-col gap-1">
							<p class="flex items-center justify-between">
								<span>
									WPM
									<Tooltip.Root>
										<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
										<Tooltip.Content class="max-w-sm">
											<p>WPM indicates the number of words spoken per minute.</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</span>
								<span> {getWPM(transcript, duration)}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div class="flex flex-col items-start justify-between md:flex-row">
					<h2 class="text-left text-lg font-semibold">Transcript</h2>

					<div class="flex gap-6 text-xs text-muted-foreground sm:text-sm">
						<div class="flex items-center gap-2">
							<div class="size-4 rounded bg-primary"></div>
							<p>
								Mispronunciations: <span class="font-semibold text-foreground">0</span>
							</p>
						</div>
						<div class="flex items-center gap-2">
							<div class="size-4 rounded bg-violet-500"></div>
							<p>Monotone: <span class="font-semibold text-foreground">0</span></p>
						</div>
					</div>
				</div>
				<div
					class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-base leading-6 text-secondary-foreground"
				>
					<p class="prose prose-sm max-w-none">{transcript}</p>
				</div>
			</div>

			<div>
				<h2 class="text-left text-lg font-semibold">Feedback</h2>
				<div
					class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-base leading-6 text-secondary-foreground"
				>
					<p class="prose prose-sm max-w-none">{generatedFeedback}</p>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div
		class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-muted p-6 shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]"
	>
		<p class="text-center text-lg font-medium text-muted-foreground">
			Camera permission is denied. We don't store your attempts anywhere, but we understand not
			wanting to give us access to your camera. Try again by opening this page in an incognito
			window (or enable permissions in your browser settings).
		</p>
	</div>
	<div class="fixed bottom-0 w-full bg-background px-4">
		<div class="container flex max-w-5xl justify-center gap-4 border-t py-6 md:justify-end">
			<Button class="group" onclick={() => location.reload()}>
				<span class="mr-2">Restart demo</span>
				<RefreshCw class="size-5 group-hover:animate-spin" />
			</Button>
		</div>
	</div>
{/if}
