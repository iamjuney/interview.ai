<script lang="ts">
	import { Badge, Button, DoughnutChart, Progress, Tooltip } from '$lib/components';
	import type { Answer } from '$lib/types';
	import { getWPM } from '$lib/utils';
	import { Loader2, X, Trash, HelpCircle } from 'lucide-svelte';
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
								<h3 class="text-xl font-semibold">Interview Assessment</h3>
								<Button size="lg" variant="destructive">
									<!-- {#if isDeleteAccountSubmitting}
							<span class="flex items-center space-x-2">
								<span>Deleting...</span>
								<Loader2 class="size-4 animate-spin" />
							</span>
						{:else} -->
									<div class="flex items-center">
										<span>Delete</span>
										<Trash class="ml-2 size-4" />
									</div>
									<!-- {/if} -->
								</Button>
							</div>
							<div class="flex flex-col space-y-6">
								<div class="flex flex-col">
									<p class="text-lg font-semibold">Recorded Answer</p>
									<video
										class="mt-3 aspect-video h-full w-full lg:rounded-xl"
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
																<p>WPM indicates the number of words spoken per minute.</p>
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
										<p class="prose prose-sm max-w-none">{answer?.answer}</p>
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
