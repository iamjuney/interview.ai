<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Badge, Button, InterviewAssessment } from '$lib/components';
	import { ArrowLeft, Loader2 } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);
	let isOpen = $state(false);
	let previousPage = $state<string>('/app/questions');
	let text = $state<string>('to questions');

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
</script>

<InterviewAssessment bind:isOpen />

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href={previousPage} data-sveltekit-preload-data class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back {text}</p>
				</a>
			</div>

			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="max-w-3xl text-3xl font-medium tracking-tight">{data.question}</h2>
				<Button size="lg" href="/app/interviews/record" data-sveltekit-preload-data="hover"
					>Record New Answer</Button
				>
			</div>
		</div>

		<div class="w-full">
			<h4 class="text-lg font-semibold">Recordings & Feedback</h4>
			<div
				class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				<button
					onclick={() => (isOpen = true)}
					class="group relative cursor-pointer rounded-xl border border-input p-4 hover:bg-secondary"
				>
					<div
						class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg"
					>
						<div class="relative h-full w-full rounded bg-white">
							<div
								class="absolute right-2 top-2 z-30 flex items-center justify-center rounded bg-gray-900 bg-opacity-50 px-1.5 py-0.5 text-[11px] font-medium text-white"
							>
								00:37
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm">January 25, 2024 </span>

						<Badge class="flex items-center">
							<Loader2 class="mr-1 size-3 animate-spin" />
							Processing...
						</Badge>
					</div>
				</button>
				<div
					class="group relative cursor-pointer rounded-xl border border-input p-4 hover:bg-secondary"
				>
					<a
						class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg"
						href="/app/interviews/record"
						data-sveltekit-preload-data
					>
						<div class="relative h-full w-full rounded-lg bg-white"></div>
					</a>
					<a href="/app/interviews/record" class="text-sm"> January 27, 2024 </a>
				</div>
			</div>
		</div>
	</div>
{/if}
