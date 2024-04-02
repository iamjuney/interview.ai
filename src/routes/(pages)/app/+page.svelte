<script lang="ts">
	import { InterviewCard } from '$lib/components';
	import { Hourglass, MonitorCheck, TrendingUp } from 'lucide-svelte';
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
		<h2 class="truncate text-3xl font-medium tracking-tight">Dashboard</h2>

		<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
			<div class="rounded-xl border bg-primary text-primary-foreground shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-primary-foreground/80">
						Completed Interviews
					</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">{data.completed}</div>
				</div>
			</div>
			<div class="rounded-xl border bg-primary text-primary-foreground shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-primary-foreground/80">
						Total Interview Time
					</h3>
					<Hourglass class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">{data.interviewTime}</div>
				</div>
			</div>
			<div class="rounded-xl border bg-primary text-primary-foreground shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-primary-foreground/80">Daily Streak</h3>
					<TrendingUp class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">{data.dailyStreak} day(s)</div>
				</div>
			</div>
		</div>

		<div class="flex w-full flex-col gap-3">
			<div class="w-full space-y-2">
				<h2 class="truncate text-xl font-medium tracking-tight">Suggested Interviews</h2>
			</div>

			<div
				class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#each data.suggestedInterviews as interview}
					<InterviewCard {interview} />
				{/each}
			</div>
		</div>
	</div>
{/if}
