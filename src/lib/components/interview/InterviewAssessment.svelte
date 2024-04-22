<script lang="ts">
	import { enhance } from '$app/forms';
	import { AlertDialog, Button, DoughnutChart, Progress, Tooltip } from '$lib/components';
	import type { Answer, Question } from '$lib/types';
	import { countMispronunciations, countMonotone, getWPM } from '$lib/utils';
	import { HelpCircle, Loader2, Trash, X } from 'lucide-svelte';
	import { CldVideoPlayer } from 'svelte-cloudinary';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen, answer, question } = $props<{
		isOpen: boolean;
		answer: Answer;
		question?: Question;
	}>();

	let assessment = $state(answer.assessment);
	let transcript = $state(assessment?.data ?? []);
	let isSubmitting = $state(false);
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
							<div class="flex items-center justify-between border-b border-accent pb-6">
								<h3 class="text-xl font-semibold">{question?.question}</h3>
								<AlertDialog.Root>
									<AlertDialog.Trigger>
										<Button
											type="submit"
											variant="destructive"
											size="icon"
											title="Delete recording"
											bind:disabled={isSubmitting}
										>
											{#if isSubmitting}
												<span class="flex items-center space-x-2">
													<span>Deleting...</span>
													<Loader2 class="size-4 animate-spin" />
												</span>
											{:else}
												<span class="sr-only">Delete recording</span>
												<Trash class="size-4" />
											{/if}
										</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												This action cannot be undone. This will permanently <strong>delete</strong> your
												answers and assessments from our servers.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<form class="mt-4" action="/app/questions?/delete" method="post" use:enhance>
												<input type="hidden" name="answer_id" value={answer.id} />
												<input type="hidden" name="question_slug" value={question?.slug} />
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<AlertDialog.Action
													on:click={() => (isOpen = false)}
													type="submit"
													class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
													>Continue</AlertDialog.Action
												>
											</form>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</div>
							<div class="flex flex-col space-y-6">
								<div class="flex flex-col">
									<p class="mb-3 text-lg font-semibold">Recorded Answer</p>
									<!-- Typescript error below is expected -->
									<CldVideoPlayer
										width={640}
										height={480}
										src={answer.videoUrl}
										class="lg:rounded-xl"
									/>
								</div>
								<div class="mx-auto flex w-full flex-col md:flex-row md:space-x-12">
									<div class="flex flex-none flex-col">
										<h2 class="mb-3 text-left text-lg font-semibold">
											Pronunciation Score
											<Tooltip.Root>
												<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
												<Tooltip.Content class="max-w-sm">
													<p>
														Overall score indicating the pronunciation quality of the given speech.
														This is aggregated from AccuracyScore, FluencyScore, and ProsodyScore.
													</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</h2>
										<DoughnutChart score={assessment!.pronunciation_score} />
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
																	Accuracy indicates how closely the phonemes match a native
																	speaker's pronunciation. Word and full text accuracy scores are
																	aggregated from phoneme-level accuracy score.
																</p>
															</Tooltip.Content>
														</Tooltip.Root>
													</span>

													<span> {assessment?.accuracy_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.accuracy_score} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span>
														Fluency score
														<Tooltip.Root>
															<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
															<Tooltip.Content class="max-w-sm">
																<p>
																	Fluency indicates how closely the speech matches a native
																	speaker's use of silent breaks between words.
																</p>
															</Tooltip.Content>
														</Tooltip.Root>
													</span>
													<span> {assessment?.fluency_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.fluency_score} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span>
														Prosody score
														<Tooltip.Root>
															<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
															<Tooltip.Content class="max-w-sm">
																<p>
																	Prosody indicates how nature of the given speech, including
																	stress, intonation, speaking speed and rhythm.
																</p>
															</Tooltip.Content>
														</Tooltip.Root>
													</span>
													<span> {assessment?.prosody_score} / 100</span>
												</p>
												<Progress class="w-full bg-gray-200" value={assessment?.prosody_score} />
											</div>
											<div class="flex flex-col gap-1">
												<p class="flex items-center justify-between">
													<span>
														WPM
														<Tooltip.Root>
															<Tooltip.Trigger><HelpCircle class="ml-2 size-3" /></Tooltip.Trigger>
															<Tooltip.Content class="max-w-sm">
																<p>
																	WPM indicates the number of words spoken per minute. A great WPM
																	during job interviews is around 120-150 WPM.
																</p>
															</Tooltip.Content>
														</Tooltip.Root>
													</span>
													{#if answer?.answer}
														<span> {getWPM(answer?.answer, answer?.duration)}</span>
													{:else}
														<span> 0</span>
													{/if}
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
												<div class="size-4 rounded bg-yellow-500"></div>
												<p>
													Mispronunciations: <span class="font-semibold text-foreground"
														>{countMispronunciations(assessment!.data)}</span
													>
												</p>
											</div>
											<div class="flex items-center gap-2">
												<div class="size-4 rounded bg-primary"></div>
												<p>
													Monotone: <span class="font-semibold text-foreground"
														>{countMonotone(assessment!.data)}</span
													>
												</p>
											</div>
										</div>
									</div>
									<div
										class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-base leading-6 text-secondary-foreground"
									>
										<p class="w-full whitespace-normal text-wrap">
											{#each answer?.answer.split(' ') as word, idx}
												{#if transcript[idx]?.errorType === 'Mispronunciation'}
													<span
														class="me-[3px] inline-block font-semibold underline decoration-yellow-500 decoration-2"
														>{word}
													</span>
												{:else if transcript[idx]?.errorType === 'Monotone'}
													<span
														class="me-[3px] inline-block font-semibold underline decoration-primary decoration-wavy decoration-2"
														>{word}
													</span>
												{:else}
													<span class="me-[3px] inline-block">{word}</span>
												{/if}
											{/each}
										</p>
									</div>
								</div>

								<div>
									<h2 class="text-left text-lg font-semibold">Feedback</h2>
									<div
										class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-base leading-6 text-secondary-foreground"
									>
										<p class="prose prose-sm max-w-none">{assessment?.feedback}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
