<script lang="ts">
	import { LineGraph, BarChart, Metric } from '$lib/components';
	import { MonitorCheck } from 'lucide-svelte';
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

		<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-3" id="Analytics">
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<LineGraph />
				</div>
			</div>
			<div class="rounded-xl border bg-background shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground/80">New Registrations</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+180.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<BarChart />
				</div>
			</div>
			<div class="rounded-xl border bg-background shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground/80">Completed Interviews</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+180.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<LineGraph />
				</div>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-3" id="Analytics">
			<div class="col-span-2 rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-[200px] px-6">
					<Metric />
				</div>
			</div>
			<div></div>
		</div>
	</div>
{/if}
