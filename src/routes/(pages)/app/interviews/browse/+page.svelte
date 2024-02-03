<script lang="ts">
	import { Button, Input, InterviewCard } from '$lib/components';
	import { ArrowLeft, Search } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};
</script>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href="/app/interviews" class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back to all interviews</p>
				</a>
			</div>
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">Select Interview</h2>
				<!-- <Button size="lg" href="/app/interviews/browse">Create Custom Interview</Button> -->
			</div>
		</div>

		<div>
			<div class="w-full">
				<label for="search" class="sr-only">Search</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Search size="20" class="text-foreground/60" />
					</div>
					<Input id="search" class="pl-10 text-base" placeholder="Search" />
				</div>
			</div>

			<div
				class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#each data.interviews as interview}
					<InterviewCard {interview} />
				{/each}
			</div>
		</div>
	</div>
{/if}
