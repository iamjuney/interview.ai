<script lang="ts">
	import { Metric, BarChart, LineGraph } from '$lib/components';
	import { MonitorCheck, Users, BarChart2 } from 'lucide-svelte';
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
	<div class="container flex flex-col pb-20 md:pt-10" in:fly={flyOptions}>
		<h2 class="truncate text-3xl font-medium tracking-tight">Dashboard</h2>

		<div class="mt-12 grid grid-cols-1 gap-4 xl:grid-cols-3">
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
						<h2 class="text-xl font-semibold">Welcome admin! 👋</h2>
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
						<h3 class="text-xl font-semibold">{data.newUsersThisMonth}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">New Users this Month</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.totalCompletedInterviews}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Total Completed Interviews</p>
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

		<div class="mt-4 grid gap-4 md:grid-cols-2">
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<Users class="size-6" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-32 px-6">
					<LineGraph />
				</div>
			</div>
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">
						Top Job Position Practiced
					</h3>
					<BarChart2 class="size-6" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">Laravel Developer</div>
				</div>
				<div class="h-32 px-6">
					<BarChart />
				</div>
			</div>
		</div>
	</div>
{/if}
