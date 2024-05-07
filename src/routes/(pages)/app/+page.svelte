<script lang="ts">
	import { InterviewCard } from '$lib/components';
	import { Hourglass, MonitorCheck, TrendingUp } from 'lucide-svelte';
	import { CldImage } from 'svelte-cloudinary';
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

	function readableDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<h2 class="truncate text-3xl font-medium tracking-tight">Dashboard</h2>

		<div class="grid grid-cols-1 gap-4 xl:grid-cols-3" id="Statistics">
			<div
				class="flex items-center justify-center rounded-lg border bg-gradient-to-br from-primary/30 to-secondary py-4 shadow"
			>
				<div class="flex items-center space-x-4">
					{#if data.user.image}
						{#if data.user.image.includes('github')}
							<img
								class="size-16 rounded-full"
								src={data.user.image}
								alt="Photo of {data.user.first_name} {data.user.last_name}"
							/>
						{:else}
							<CldImage
								src={data.user.image}
								crop="fill"
								width={64 * 4}
								height={64 * 4}
								sizes="100vw"
								alt="Photo of {data.user.first_name} {data.user.last_name}"
							/>
						{/if}
					{:else}
						<img src="/assets/poddle.webp" alt="avatar" class="size-12 rounded-full" />
					{/if}
					<div>
						<h2 class="text-xl font-semibold">
							Welcome {data.user.first_name} 👋
						</h2>
						<div class="flex flex-row items-center">
							<div class="h-4 w-[2px] bg-primary"></div>
							<p class="ml-2 text-muted-foreground">{data.user.email}</p>
						</div>

						<p class="text-muted-foreground">Joined on {readableDate(data.user.created_at)}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg xl:col-span-2">
				<h2 class="mb-4 text-xl font-medium tracking-tight">Statistics</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.in_progress}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Ongoing Interviews</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.completed}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Completed Interviews</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.totalQuestionsAnswered}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Total Questions Answered</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.averageAnswerDuration}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Average Answer Duration</p>
					</div>
				</div>
			</div>
		</div>

		<div class="flex w-full flex-col gap-3">
			<div class="w-full space-y-2">
				<h2 class="truncate text-xl font-medium tracking-tight">Suggested Interviews</h2>
			</div>

			<div
				id="SuggestedInterviews"
				class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#each data.suggestedInterviews as interview}
					<InterviewCard {interview} />
				{/each}
			</div>
		</div>
	</div>
{/if}
