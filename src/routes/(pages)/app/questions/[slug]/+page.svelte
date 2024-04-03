<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Button, InterviewAssessment } from '$lib/components';
	import type { Answer } from '$lib/types.js';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { CldVideoPlayer } from 'svelte-cloudinary';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);
	let isOpen = $state(false);
	let previousPage = $state<string>('/app/questions');
	let text = $state<string>('to questions');
	let selectedAnswer = $state<Answer>();

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;

		if (previousPage !== '/app/questions') {
			text = 'to interview';
		}
	});

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	function readableDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function readableTime(duration: number) {
		const minutes = Math.floor(duration / 60);
		const seconds = duration % 60;
		return `${minutes}:${seconds}`;
	}
</script>

{#if selectedAnswer}
	<InterviewAssessment bind:isOpen answer={selectedAnswer} question={data.questionDetails} />
{/if}

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href={previousPage} data-sveltekit-preload-data class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back {text}</p>
				</a>
			</div>

			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="max-w-3xl text-3xl font-medium tracking-tight">
					{data.questionDetails?.question}
				</h2>
				<Button
					size="lg"
					href="/app/questions/{data.questionDetails?.slug}/record"
					data-sveltekit-preload-data="hover">Record New Answer</Button
				>
			</div>
		</div>

		<div class="w-full">
			<h4 class="text-lg font-semibold">Recordings & Feedback</h4>
			<div
				class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#if data.answers.length === 0}
					<p class="text-muted-foreground">No recordings available</p>
				{/if}
				{#each data.answers as answer (answer.id)}
					<button
						onclick={() => {
							isOpen = true;
							selectedAnswer = answer;
						}}
						class="group relative cursor-pointer rounded-xl border border-input p-4 hover:bg-secondary"
					>
						<div
							class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg"
						>
							<div class="relative h-full w-full rounded">
								<CldVideoPlayer
									width={326}
									height={183}
									controls={false}
									src={answer.videoUrl}
									class="rounded-xl"
								/>
								<div
									class="absolute right-2 top-2 z-30 flex items-center justify-center rounded bg-gray-900 bg-opacity-50 px-1.5 py-0.5 text-[11px] font-medium text-white"
								>
									{readableTime(answer.duration)}
								</div>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<div class="flex flex-col text-start">
								<p class="font-semibold">
									<span>Overall Score: </span>
									<span> {answer.assessment?.pronunciation_score}</span>
								</p>
								<p class="text-sm">
									Recorded on {readableDate(answer.createdAt)}
								</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
