<script lang="ts">
	import { BarChart, LineGraph } from '$lib/components';
	import { Library, TrendingDown, TrendingUp, Users } from 'lucide-svelte';
	import { CldImage } from 'svelte-cloudinary';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);

	let lastMonth = $derived(data.totalActiveUsersEveryMonth[10].users);
	let thisMonth = $derived(data.totalActiveUsersEveryMonth[11].users);
	let percentage = $derived(() => {
		if (lastMonth === 0) {
			return thisMonth * 100;
		} else if (thisMonth === 0) {
			return -lastMonth * 100;
		} else {
			return Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(2));
		}
	});

	let topJobPositionsData = $derived(() => {
		return data.topJobPositions.map((d: any, i: number) => ({
			id: i,
			count: d.count,
			position: d.position
		}));
	});

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
					<div class="text-3xl font-bold">{thisMonth}</div>
					<p class="inline-flex text-sm text-muted-foreground">
						{#if percentage() > 0}
							<TrendingUp class="mr-2 size-5 text-green-500" />
						{:else}
							<TrendingDown class="mr-2 size-5 text-red-500" />
						{/if}
						{percentage()}% from last month
					</p>
				</div>
				<div class="h-32 px-6">
					<LineGraph data={data.totalActiveUsersEveryMonth} />
				</div>
			</div>
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">
						Most Practiced Job Position
					</h3>
					<Library class="size-6" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">
						{data.topJobPositions[0].position}
					</div>
				</div>
				<div class="h-32 px-6">
					<BarChart data={topJobPositionsData()} />
				</div>
			</div>
		</div>
	</div>
{/if}
