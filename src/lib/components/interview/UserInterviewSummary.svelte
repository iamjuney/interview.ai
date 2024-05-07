<script lang="ts">
	import { Accordion, Button } from '$lib/components';
	import type { UserInterview } from '$lib/types';
	import { Gauge, X } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { countMispronunciations, countMonotone, getWPM } from '$lib/utils';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen, userInterview } = $props<{
		isOpen: boolean;
		userInterview: UserInterview;
	}>();

	let isMounted = $state(false);

	$effect(() => {
		isMounted = true;
	});
</script>

{#if isOpen && isMounted}
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
				aria-hidden={isOpen}
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

							<div class="flex flex-col space-y-6">
								<p class="text-xl font-semibold">{userInterview.interview?.position}</p>
								<hr />

								{#each userInterview.interview!.questions as question}
									{#if question.answers && question.answers.length > 0}
										<div>
											<h2 class="text-left text-xl font-semibold">
												{question.question}
											</h2>

											{#each question.answers as answer, idx}
												<Accordion.Root class="pl-6">
													<Accordion.Item value="item-1">
														<Accordion.Trigger class="text-start text-lg"
															>Recording ({idx + 1})</Accordion.Trigger
														>
														<Accordion.Content class="pl-6">
															<div>
																<h2 class="text-left font-semibold">Speech Assessment Scores</h2>
																<div class="mt-3 grid grid-cols-3 gap-2 text-sm">
																	<div class="flex items-center gap-2">
																		<Gauge class="size-4 text-primary" />
																		<span class="font-medium"
																			>{answer.assessment?.pronunciation_score}</span
																		>
																		<span>Pronunciation Score</span>
																	</div>
																	<div class="flex items-center gap-2">
																		<Gauge class="size-4 text-primary" />
																		<span class="font-medium"
																			>{answer.assessment?.accuracy_score}</span
																		>

																		<span>Clarity Score</span>
																	</div>
																	<div class="flex items-center gap-2">
																		<Gauge class="size-4 text-primary" />
																		<span class="font-medium">
																			{getWPM(answer?.answer, answer?.duration)}
																		</span>
																		<span>WPM</span>
																	</div>
																	<div class="flex items-center gap-2">
																		<Gauge class="size-4 text-primary" />
																		<span class="font-medium"
																			>{answer.assessment?.fluency_score}</span
																		>
																		<span>Fluency Score</span>
																	</div>
																	<div class="flex items-center gap-2">
																		<Gauge class="size-4 text-primary" />
																		<span class="font-medium"
																			>{answer.assessment?.prosody_score}</span
																		>
																		<span>Prosody Score</span>
																	</div>
																</div>
															</div>
															<div>
																<h2 class="text-left font-semibold">User Transcript</h2>
																<div
																	class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-sm leading-6 text-secondary-foreground"
																>
																	<p>
																		{answer.answer}
																	</p>
																</div>
															</div>

															<div>
																<h2 class="text-left font-semibold">Feedback</h2>
																<div
																	class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-sm leading-6 text-secondary-foreground"
																>
																	<p>
																		{answer.assessment?.feedback}
																	</p>
																</div>
															</div>
														</Accordion.Content>
													</Accordion.Item>
												</Accordion.Root>
											{/each}
										</div>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
