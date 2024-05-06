<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let user = $state(data.userDetails);
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
				<a href="/admin/users" class="group flex items-center gap-2" data-sveltekit-preload-data>
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to users</p>
				</a>
			</div>
		</div>

		<h1 class="truncate text-3xl font-medium tracking-tight">User Full Data</h1>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">User Details</h2>
			<p class="text-muted-foreground">Hello World</p>
		</div>
	</div>
{/if}
