<script lang="ts">
	import { Badge, Button, DoughnutChart, Progress } from '$lib/components';
	import type { Answer } from '$lib/types';
	import { Loader2, X, Trash } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen, answer } = $props<{ isOpen: boolean; answer?: Answer }>();

	let assessment = $derived(answer?.assessment);
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 overflow-hidden"
		aria-labelledby="slide-over-title"
		role="dialog"
		aria-modal={isOpen}
		transition:fly={flyOptions}
	>
		<div class="absolute inset-0 overflow-hidden">
			<div
				role="button"
				on:click={() => (isOpen = !isOpen)}
				class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>
			<div class="fixed inset-y-0 right-0 flex max-w-full">
				<div class="relative w-screen max-w-2xl">
					<div class="absolute left-0 top-0 -ml-12 hidden pr-2 pt-6 sm:-ml-12 sm:flex sm:pr-4">
						<Button size="icon" on:click={() => (isOpen = !isOpen)}>
							<span class="sr-only">Close menu</span>
							<X class="size-6" />
						</Button>
					</div>

					<div class="h-full overflow-y-auto bg-background">
						<div class="flex flex-col gap-6 px-6 py-8">
							<Button class="sm:hidden" size="icon" on:click={() => (isOpen = !isOpen)}>
								<span class="sr-only">Close menu</span>
								<X class="size-6" />
							</Button>
							<div class="flex items-center justify-between border-b border-accent pb-6">
								<h3 class="text-lg font-semibold">Interview Assessment</h3>
								<Button size="icon" variant="ghost">
									<Trash class="size-6 text-destructive" />
								</Button>
							</div>
							<div class="flex flex-col space-y-6">
								<div class="flex flex-col">
									<p class="font-medium">Question</p>
									<p class="mt-2 text-xl font-semibold">What is React?</p>
								</div>
								<div class="flex flex-col">
									<p class="font-medium">Recorded Answer</p>
									<video
										class="mt-2 aspect-video h-full w-full lg:rounded-xl"
										crossorigin="anonymous"
										controls
									>
										<source src={answer?.videoUrl} type="video/mp4" />
										<track kind="captions" />
										Your browser does not support the video tag.
									</video>
								</div>
								<div class="mx-auto flex w-full flex-col md:flex-row md:space-x-12">
									<div class="flex flex-none flex-col">
										<h2 class="mb-3 text-left text-lg font-semibold">Pronunciation Score</h2>
										<DoughnutChart score={assessment!.pronunciation_score} />
									</div>

									<div class="mt-12 grow md:mt-0">
										<h2 class="text-lg font-semibold">Score breakdown</h2>
										<div class="mt-3 flex flex-col space-y-6 text-sm font-medium">
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span> WPM </span>
													<span> 96 / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={96} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span> Accuracy score </span>
													<span> {assessment?.accuracy_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.accuracy_score} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span> Fluency score </span>
													<span> {assessment?.fluency_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.fluency_score} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span> Prosody score </span>
													<span> {assessment?.prosody_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.prosody_score} />
											</div>
										</div>
									</div>
								</div>
								<div class="flex flex-col">
									<p class="font-medium">Transcript</p>
									<p class="mt-2 text-sm leading-6">
										{answer?.answer}
									</p>
								</div>

								<div class="flex flex-col">
									<p class="font-medium">Feedback</p>
									<p class="mt-2 text-sm leading-6">
										{assessment?.feedback}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
