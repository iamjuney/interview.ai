<script lang="ts">
	import { Button } from '$lib/components';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { fetchFile, toBlobURL } from '@ffmpeg/util';
	import { untrack } from 'svelte';
	import { ArrowRight, Loader2, RefreshCw, ShieldQuestion } from 'lucide-svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { useChat } from 'ai/svelte';

	const { input, handleSubmit, messages } = useChat();

	let { question } = $props<{ question: string }>();

	let ffmpeg = $state<FFmpeg | null>(null);
	let countdown = $state(150);
	let stream = $state<MediaStream | null>(null);
	let videoRef = $state<HTMLVideoElement | null>(null);
	let mediaRecorderRef = $state<MediaRecorder | null>(null);
	let recordedChunks = $state<Blob[]>([]);
	let cameraLoading = $state(true);
	let cameraLoaded = $state(true);
	let cameraRecording = $state(false);
	let isSuccess = $state(false);
	let isSubmitting = $state(false);
	let status = $state('');
	let completed = $state(false);
	let transcript = $state('');
	let generatedFeedback = $state('');

	// handles the camera stream
	$effect(() => {
		untrack(() => {
			(async () => {
				await loadFfmpeg();
				await getStream();
			})();
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
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});

			if (videoRef) {
				videoRef.srcObject = stream;
			}

			cameraLoading = false;
		} catch (err) {
			cameraLoaded = false;
		}
	}

	// function to stop the camera stream
	function stopStream() {
		if (stream) {
			stream.getTracks().forEach((track) => {
				track.stop();
			});
			if (videoRef) videoRef.srcObject = null;
		}
	}

	// function to load ffmpeg
	async function loadFfmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
		ffmpeg = new FFmpeg();

		ffmpeg.on('log', ({ message }) => {
			console.log(message);
		});

		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
		});
	}

	// function to handle the start of the recording
	function handleStartCaptureClick() {
		cameraRecording = true;
		mediaRecorderRef = new MediaRecorder(stream!);
		mediaRecorderRef.ondataavailable = (e) => {
			recordedChunks.push(e.data);
			console.log('chunk added.');
		};
		mediaRecorderRef.start();
	}

	// function to handle the stop of the recording
	function handleStopCaptureClick() {
		mediaRecorderRef?.stop();
		cameraRecording = false;
		countdown = 0;
	}

	// function to handle the restart of the recording
	function handleRestartClick() {
		recordedChunks = [];
		countdown = 150;
	}

	// function to handle the processing of the recording
	async function handleProcessClick() {
		const unique_id = uuidv4();

		if (recordedChunks.length) {
			isSubmitting = true;
			status = 'Converting';

			const blob = new Blob(recordedChunks, {
				type: 'video/webm'
			});

			// write the file to memory, removes the video, and converts the audio to wav
			ffmpeg?.writeFile(`${unique_id}.webm`, await fetchFile(blob));
			await ffmpeg?.exec([
				'-i',
				`${unique_id}.webm`,
				'-vn',
				'-acodec',
				'pcm_s16le',
				'-ac',
				'1',
				'-ar',
				'16000',
				`${unique_id}.wav`
			]);

			status = 'Reading';

			// read the converted file from the file system
			const fileData = await ffmpeg?.readFile(`${unique_id}.wav`);
			const output = new File([(fileData as Uint8Array).buffer], `${unique_id}.wav`, {
				type: 'audio/wav'
			});

			// const formData = new FormData();
			// formData.append('file', output, `${unique_id}.wav`);
			// formData.append('model', 'whisper-1');

			// status = 'Transcribing';

			// const upload = await fetch(
			// 	`/api/v1/transcribe?question=${encodeURIComponent(questions[0])}`,
			// 	{
			// 		method: 'POST',
			// 		body: formData
			// 	}
			// );

			// const results = await upload.json();

			// if (!upload.ok) console.error('Upload failed.');

			// isSuccess = true;
			// isSubmitting = false;
			// transcript = results.transcript;
			// generatedFeedback = results.feedback;
			// completed = true;

			// if (results.error) transcript = results.error;

			// transcript = results.transcript;

			// console.log('Uploaded successfully!');

			// // reset the recording after 1.5 seconds
			// setTimeout(function () {
			// 	recordedChunks = [];
			// }, 1500);
		}
	}
</script>

<!-- <section>
	<h1>useChat</h1>
	<ul>
		{#each $messages as message}
			<li>{message.role}: {message.content}</li>
		{/each}
	</ul>
	<form on:submit={handleSubmit}>
		<input bind:value={$input} />
		<button type="submit">Send</button>
	</form>
</section> -->

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
