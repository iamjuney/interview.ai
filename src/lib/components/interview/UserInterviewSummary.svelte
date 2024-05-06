<script lang="ts">
	import { Accordion, Button } from '$lib/components';
	import { Gauge, X } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen } = $props<{
		isOpen: boolean;
	}>();
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

							<div class="flex flex-col space-y-6">
								<p class="text-xl font-semibold">Android App Developer</p>
								<hr />

								<div>
									<h2 class="text-left text-xl font-semibold">
										1. What attracted you to a career in Laravel development, and what are your
										goals in this field?
									</h2>
									<Accordion.Root class="pl-6">
										<Accordion.Item value="item-1">
											<Accordion.Trigger class="text-start text-lg">Recording (1)</Accordion.Trigger
											>
											<Accordion.Content class="pl-6">
												<div>
													<h2 class="text-left font-semibold">Speech Assessment Scores</h2>
													<div class="mt-3 grid grid-cols-3 gap-2 text-sm">
														<div class="flex items-center gap-2">
															<Gauge class="size-4 text-primary" />
															<span class="font-medium">88</span>
															<span>Pronunciation Score</span>
														</div>
														<div class="flex items-center gap-2">
															<Gauge class="size-4 text-primary" />
															<span class="font-medium">78</span>

															<span>Clarity Score</span>
														</div>
														<div class="flex items-center gap-2">
															<Gauge class="size-4 text-primary" />
															<span class="font-medium">120</span>
															<span>WPM</span>
														</div>
														<div class="flex items-center gap-2">
															<Gauge class="size-4 text-primary" />
															<span class="font-medium">56</span>
															<span>Fluency Score</span>
														</div>
														<div class="flex items-center gap-2">
															<Gauge class="size-4 text-primary" />
															<span class="font-medium">67</span>
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
															As someone deeply passionate about web development, Laravel's elegant
															syntax and expressive design principles instantly drew me in. The
															framework's emphasis on pragmatic simplicity while offering robust
															features resonates with my desire to craft efficient and maintainable
															applications. My goal is to become a versatile Laravel developer,
															proficient in building scalable and secure web applications. I aim to
															continuously expand my knowledge of Laravel's ecosystem, including its
															ORM, routing, and testing capabilities. Ultimately, I aspire to
															contribute to open-source Laravel projects and share my expertise with
															the community.
														</p>
													</div>
												</div>

												<div>
													<h2 class="text-left font-semibold">Feedback</h2>
													<div
														class="mt-3 flex min-h-[100px] gap-2.5 rounded-lg bg-secondary p-4 text-sm leading-6 text-secondary-foreground"
													>
														<p>
															The candidate provided a strong response that highlights their passion
															for web development, appreciation for Laravel's features, and clear
															career goals within the field. To further improve, consider mentioning
															specific projects or experiences that have shaped your interest in
															Laravel development. Additionally, you could elaborate on how you plan
															to stay updated with the latest trends and advancements in the Laravel
															ecosystem. Your response can be enhanced by providing concrete
															examples of how you plan to contribute to open-source Laravel projects
															and engage with the community.
														</p>
													</div>
												</div>
											</Accordion.Content>
										</Accordion.Item>
									</Accordion.Root>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
