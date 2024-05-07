<script lang="ts">
	import { Accordion, Button } from '$lib/components';
	import type { UserInterview } from '$lib/types';
	import { getWPM, countMispronunciations } from '$lib/utils';
	import { Gauge, X } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen, userInterview, noAnswers } = $props<{
		isOpen: boolean;
		userInterview: UserInterview;
		noAnswers: boolean;
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

								{#if userInterview.interview}
									{#each userInterview.interview.questions as question}
										{#if question.answers && question.answers.length > 0}
											<div>
												<h2 class="text-left text-base font-semibold md:text-lg">
													{question.question}
												</h2>

												{#each question.answers as answer, idx}
													<Accordion.Root class="pl-3 md:pl-6">
														<Accordion.Item value="item-1">
															<Accordion.Trigger class="text-start text-lg"
																>Recording ({idx + 1})</Accordion.Trigger
															>
															<Accordion.Content class="pl-3 md:pl-6">
																<div>
																	<h2 class="text-left font-semibold">Speech Assessment Scores</h2>
																	<div class="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
																		<div class="flex items-center gap-2">
																			<Gauge class="size-4 text-primary" />
																			<span class="font-medium"
																				>{answer.assessment?.pronunciation_score}</span
																			>
																			<span>Pronunciation</span>
																		</div>
																		<div class="flex items-center gap-2">
																			<Gauge class="size-4 text-primary" />
																			<span class="font-medium"
																				>{answer.assessment?.accuracy_score}</span
																			>

																			<span>Clarity</span>
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
																			<span>Fluency</span>
																		</div>
																		<div class="flex items-center gap-2">
																			<Gauge class="size-4 text-primary" />
																			<span class="font-medium"
																				>{answer.assessment?.prosody_score}</span
																			>
																			<span>Prosody</span>
																		</div>
																	</div>
																</div>

																<div>
																	<div class="flex items-start justify-between">
																		<h2 class="text-left font-semibold">User Transcript</h2>

																		<div class="flex gap-6 text-muted-foreground sm:text-sm">
																			<div class="flex items-center gap-2">
																				<div class="size-4 rounded bg-yellow-500"></div>
																				<p>
																					Mispronunciations:
																					{#if answer.assessment}
																						<span class="font-semibold text-foreground"
																							>{countMispronunciations(answer.assessment.data)}
																						</span>
																					{/if}
																				</p>
																			</div>
																		</div>
																	</div>

																	<div
																		class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-sm leading-6 text-secondary-foreground"
																	>
																		<!-- <p>
																			{answer.answer}
																		</p> -->
																		<p class="w-full whitespace-normal text-wrap">
																			{#if answer.assessment}
																				{#each answer.answer.split(' ') as word, idx}
																					{#if answer.assessment.data[idx]?.errorType === 'Mispronunciation'}
																						<span
																							class="me-[3px] inline-block font-semibold underline decoration-yellow-500 decoration-2"
																							>{word}
																						</span>
																					{:else}
																						<span class="me-[3px] inline-block">{word}</span>
																					{/if}
																				{/each}
																			{/if}
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
								{/if}

								{#if noAnswers}
									<p class="text-base text-muted-foreground">
										No answers have been recorded for this interview.
									</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
