<script lang="ts">
	import { AlertDialog, Button, InterviewStage, Tooltip } from '$lib/components';
	import { ArrowLeft, HelpCircle, Mic, Volume2 } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let question = $state(data.questionDetails);
	let animate = $state(false);
	let showDialog = $state(true);
	let isLoaded = $state(false);

	let screenStream = $state<MediaStream>();
	let audioStream = $state<MediaStream>();
	let videoRef = $state<HTMLVideoElement>();
	let audioPermission = $state(false);
	let videoPermission = $state(false);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	// handles the camera stream
	$effect(() => {
		untrack(async () => {
			await getStream();
		});

		return () => {
			stopStream();
		};
	});

	// function to check if the user has given permission to use the camera and microphone
	$effect(() => {
		if (screenStream && audioStream) {
			audioPermission = audioStream.getAudioTracks().length > 0;
			videoPermission = screenStream.getVideoTracks().length > 0;
		}
	});

	// function to get the camera stream
	async function getStream() {
		try {
			screenStream = await navigator.mediaDevices.getUserMedia({
				video: true
			});

			audioStream = await navigator.mediaDevices.getUserMedia({
				audio: true
			});

			if (videoRef) {
				videoRef.srcObject = screenStream;
			}
		} catch (err) {
			console.error(err);
		}
	}

	// function to stop the camera stream
	function stopStream() {
		if (screenStream && audioStream) {
			screenStream.getTracks().forEach((track) => {
				track.stop();
			});
			audioStream.getTracks().forEach((track) => {
				track.stop();
			});
			if (videoRef) videoRef.srcObject = null;
		}
	}
</script>

<AlertDialog.Root open={showDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Check your video and sound devices</AlertDialog.Title>
			<AlertDialog.Description>
				<div class="text-foreground/80">
					Before we start, we need to check if your camera and microphone are working.
				</div>
				<div class="mt-6 flex w-full flex-col gap-3">
					<div class="relative aspect-video h-full w-full bg-muted">
						<!-- svelte-ignore a11y-media-has-caption -->
						<video
							bind:this={videoRef}
							autoplay
							playsinline
							class="absolute z-20 h-full w-full -scale-x-100 rounded-lg object-cover"
						>
						</video>
					</div>
					<div class="text-foreground/80">
						(Note: Please make sure to position yourself in the center of the frame and that your
						face is well lit.)
					</div>
					<div class="mt-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<Volume2 class="size-6 text-muted-foreground" />
								<span class="ml-2 text-sm font-medium">Can you hear the audio?</span>
							</div>
							<div>
								<Button
									variant="link"
									on:click={() => {
										const audio = new Audio('/assets/test_sound.mp3');
										audio.play();
									}}
								>
									Test
								</Button>
								<Tooltip.Root>
									<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
									<Tooltip.Content>
										<p>Click to test your speakers.</p>
										<p>
											Audio used is from <a
												class="underline"
												href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=156911"
												>Pixabay</a
											>
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
						</div>
						<div class="mt-4 flex items-center">
							{#if audioPermission}
								<Mic class="size-6 text-green-500" />
								<span class="ml-2 text-sm font-medium text-green-500">Microphone is detected</span>
							{:else}
								<Mic class="size-6 text-red-500" />
								<span class="ml-2 text-sm font-medium text-red-500">Microphone is not detected</span
								>
							{/if}
						</div>
					</div>
				</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="mt-8">
			<Button variant="outline" href="/app/questions/{question.slug}" class="mt-2 sm:mt-0"
				>Cancel</Button
			>
			<AlertDialog.Action
				disabled={!audioPermission || !videoPermission}
				on:click={() => {
					isLoaded = true;
				}}>All Good?</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href="/app/questions/" class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to all recordings</p>
				</a>
			</div>

			<div class="flex w-full items-center justify-between">
				<h2 class="max-w-3xl text-3xl font-medium tracking-tight">{question?.question}</h2>
			</div>
		</div>

		<div class="w-full">
			{#if isLoaded}
				<InterviewStage user={data.user} {question} />
			{/if}
		</div>
	</div>
{/if}
