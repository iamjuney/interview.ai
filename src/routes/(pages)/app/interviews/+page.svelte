<script lang="ts">
	import { Button, InterviewCard, Tabs } from '$lib/components';
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
		<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<h2 class="text-3xl font-medium tracking-tight">My Interviews</h2>
			<Button size="lg" href="/app/interviews/browse" data-sveltekit-preload-data="hover"
				>Start New Interview</Button
			>
		</div>

		<Tabs.Root value="all" class="w-full">
			<div class="grid w-full place-content-center md:place-content-start">
				<Tabs.List>
					<Tabs.Trigger value="all">All</Tabs.Trigger>
					<Tabs.Trigger value="ongoing">In-Progress</Tabs.Trigger>
					<Tabs.Trigger value="completed">Completed</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="all">
				{#if data.all.length > 0}
					<div
						class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
					>
						{#each data.all as interview}
							<InterviewCard interview={interview.interview} status={interview.status} />
						{/each}
					</div>
				{:else}
					<div class="mt-8 w-full">
						<p class="text-muted-foreground">No interviews found.</p>
					</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="ongoing">
				{#if data.in_progress.length > 0}
					<div
						class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
					>
						{#each data.in_progress as interview}
							<InterviewCard interview={interview.interview} status={interview.status} />
						{/each}
					</div>
				{:else}
					<div class="mt-8 w-full">
						<p class="text-muted-foreground">No interviews found.</p>
					</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="completed">
				{#if data.completed.length > 0}
					<div
						class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
					>
						{#each data.completed as interview}
							<InterviewCard interview={interview.interview} status={interview.status} />
						{/each}
					</div>
				{:else}
					<div class="mt-8 w-full">
						<p class="text-muted-foreground">No interviews found.</p>
					</div>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
