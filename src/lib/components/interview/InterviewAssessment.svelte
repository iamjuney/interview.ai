<script lang="ts">
	import { Button, Badge } from '$lib/components';
	import { X, Trash2, Loader2 } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		x: 30,
		easing: backOut
	};

	let { isOpen, assessment } = $props<{ isOpen: boolean; assessment?: any }>();
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
				<div class="relative w-screen max-w-lg">
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
								<Badge class="flex items-center">
									<Loader2 class="mr-1 size-3 animate-spin" />
									Processing...
								</Badge>
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
										<source src="" type="video/mp4" />
										<track kind="captions" />
										Your browser does not support the video tag.
									</video>
								</div>
								<div class="grid grid-cols-4 gap-2 divide-x divide-accent">
									<div class="flex flex-col items-center justify-center">
										<p class="text-sm text-foreground/60">WPM</p>
										<h3 class="font-semibold">87</h3>
									</div>
									<div class="flex flex-col items-center justify-center">
										<p class="text-sm text-foreground/60">Accuracy</p>
										<h3 class="font-semibold">96%</h3>
									</div>
									<div class="flex flex-col items-center justify-center">
										<p class="text-sm text-foreground/60">Pronunciation</p>
										<h3 class="font-semibold">95%</h3>
									</div>
									<div class="flex flex-col items-center justify-center">
										<p class="text-sm text-foreground/60">Fluency</p>
										<h3 class="font-semibold">95%</h3>
									</div>
								</div>
								<div class="flex flex-col">
									<p class="font-medium">Transcript</p>
									<p class="mt-2 text-sm leading-6">
										In early 2020, several small businesses were struggling with sudden, but
										necessary, pandemic restrictions. My co-workers and I then decided to create
										volunteer consulting teams to offer free support to these local businesses in
										navigating the early months of lockdown. I analyzed their financials and
										developed a robust emergency action plan to increase revenue, including the idea
										of keeping track of recurring medicines sold by the pet store, and calling
										clients to remind them of renewal time. Our client saw a revenue increase of 65%
										after implementing our recommendations.
									</p>
								</div>

								<div class="flex flex-col">
									<p class="font-medium">Feedback</p>
									<p class="mt-2 text-sm leading-6">
										This is a great response! It provides a clear example of a problem that you had
										to solve under unexpected circumstances, with a successful outcome. You could
										further improve the response by providing more details of the solutions you
										implemented, such as what strategies you used to call clients or how you tracked
										recurring medicines. You could also add details about the impact of your
										solutions, such as how many customers you contacted, or how long it took for the
										business to see an increase in revenues. Overall, this is a strong response that
										paints a vivid picture of the problem-solving process.
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
