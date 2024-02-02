<script lang="ts">
	import { Button, InterviewCard, Tabs } from '$lib/components';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let allInterviews = $derived(data.all);
	let inProgress = $derived(data.in_progress);
	let completed = $derived(data.completed);
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

{#snippet contentCard(interviews)}
	<div
		class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
	>
		{#each interviews as interview}
			<InterviewCard {interview} />
		{/each}
	</div>
{/snippet}

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<h2 class="text-3xl font-medium tracking-tight">My Interviews</h2>
			<Button size="lg" href="/app/interviews/browse">Start New Interview</Button>
		</div>

		<Tabs.Root value="all" class="w-full">
			<Tabs.List>
				<Tabs.Trigger value="all">All</Tabs.Trigger>
				<Tabs.Trigger value="ongoing">In-Progress</Tabs.Trigger>
				<Tabs.Trigger value="completed">Completed</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="all">
				{@render contentCard(allInterviews)}
			</Tabs.Content>
			<Tabs.Content value="ongoing">
				{@render contentCard(inProgress)}
			</Tabs.Content>
			<Tabs.Content value="completed">
				{@render contentCard(completed)}
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
