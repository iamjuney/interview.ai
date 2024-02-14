<script lang="ts">
	import { Button } from '$lib/components';
	import type { Question } from '$lib/types';
	import { ArrowRight, Loader2, RefreshCw, ShieldQuestion } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

	const ffmpeg = createFFmpeg({
		corePath: `/ffmpeg/dist/ffmpeg-core.js`
		// I've included a default import above (and files in the public directory), but you can also use a CDN like this:
		// corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
		// corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
		// log: true,
	});

	let { question } = $props<{ question: Question }>();
	const uniqueId = uuidv4();

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
	let isSuccess = $state(false);
	let isSubmitting = $state(false);
	let status = $state('');
	let completed = $state(false);
	let errorMessage = $state('');

	let videoFile = $state<File>();
	let audioFile = $state<File>();
	let transcript = $state('');
	let generatedFeedback = $state('');
	let assessmentData = $state<any>(null);

	async function loadFFmpeg() {
		if (!ffmpeg.isLoaded()) {
			await ffmpeg.load();
		}
	}

	async function convertToWav(file: File) {
		await loadFFmpeg();
		ffmpeg.FS('writeFile', file.name, await fetchFile(file));
		await ffmpeg.run('-i', file.name, '-ac', '1', '-ar', '16000', 'output.wav');
		const data = ffmpeg.FS('readFile', 'output.wav');
		return new File([data.buffer], 'output.wav', { type: 'audio/wav' });
	}

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
		countdown = 0;
	}

	// function to handle the restart of the recording
	function handleRestartClick() {
		audioChunks = [];
		recordedChunks = [];
		countdown = 150;
	}

	// function to handle the processing of the recording
	function convertProcess() {
		// set the status to converting
		status = 'Converting';

		const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
		const recordBlob = new Blob(recordedChunks, { type: 'video/webm' });

		// create files from the blobs
		audioFile = new File([audioBlob], `${uniqueId}.webm`, { type: 'audio/webm' });
		videoFile = new File([recordBlob], `video.webm`, { type: 'video/webm' });
	}

	async function transcribeProcess() {
		// set the status to transcribing
		status = 'Transcribing';

		const form = new FormData();

		if (audioFile) {
			form.append('file', audioFile, audioFile.name);
			form.append('model', 'whisper-1');
			form.append('model', 'whisper-1');
		}

		const upload = await fetch('/api/transcribe', {
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

	async function feedbackProcess() {
		// set the status to chatting
		status = 'Generating Feedback';

		const prompt = `Please give feedback on the following interview question: ${question} given the following transcript: ${transcript}`;

		const upload = await fetch(`/api/chat`, {
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

	async function assessmentProcess() {
		// set the status to assessing
		status = 'Assessing';

		const form = new FormData();
		const duration = audioChunks.length / 44100;

		// calculate the wpm
		const words = transcript.split(' ').length;
		const wpm = Math.round(words / (Number(duration) / 60));

		if (audioFile) {
			const wavFile = await convertToWav(audioFile);

			form.append('file', wavFile, wavFile.name);
			form.append('transcript', transcript);
			form.append('duration', duration.toString());
		}

		const upload = await fetch(`/api/assessment`, {
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

		assessmentData = results.assessment;

		const assessmentChuchu = {
			feedback: generatedFeedback,
			wpm: wpm,
			accuracy: assessmentData.NBest[0]?.PronunciationAssessment?.AccuracyScore,
			fluency: assessmentData.NBest[0]?.PronunciationAssessment?.FluencyScore,
			pronunciation: assessmentData.NBest[0]?.PronunciationAssessment?.PronScore,
			data: assessmentData
		};

		console.log(assessmentChuchu);
	}

	// function to handle the processing of the recording
	async function handleProcessClick() {
		if (audioChunks.length && recordedChunks.length) {
			isSubmitting = true;

			convertProcess();

			// set the status to uploading
			// status = 'Uploading';

			// upload video to vercel blob
			// const newBlob = (await upload(`recordings/${videoFile.name}`, videoFile, {
			// 	access: 'public',
			// 	handleUploadUrl: '/api/upload'
			// })) as PutBlobResult;

			await transcribeProcess();
			await feedbackProcess();
			await assessmentProcess();

			// status = 'Completed';

			// isSuccess = true;
			// isSubmitting = false;

			// // set the status to completed

			// // reset the recording after 1.5 seconds
			// setTimeout(function () {
			// 	recordedChunks = [];
			// }, 1500);
		}
	}
</script>

<svelte:window
	on:beforeunload={() => {
		stopStream();
	}}
/>

{#if cameraLoaded}
	<div
		class="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden rounded-lg bg-muted shadow-md ring-1 ring-gray-900/5"
		style="transform: none;"
	>
		<div class="relative z-10 h-full w-full rounded-lg">
			{#if completed}{:else}
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
					{#if recordedChunks.length > 0}
						{#if isSuccess}{:else}
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
						{/if}
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
				</div>
			</div>
		</div>
		<div
			class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-semibold text-white"
			id="countdown"
		></div>
	</div>
	<div class="mt-4 flex flex-row items-center space-x-1" style="opacity: 1; transform: none;">
		<ShieldQuestion class="size-4 text-muted-foreground" />
		<p class="text-sm font-normal leading-[20px]">
			Video is not stored on our servers, it is solely used for transcription.
		</p>
	</div>
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
