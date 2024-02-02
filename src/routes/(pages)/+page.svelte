<script lang="ts">
	import { Button, Header } from '$lib/components';
	import { ArrowRight } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	let { data } = $props();
	let animate = $state(false);

	$effect(() => {
		animate = true;
	});
</script>

<Header session={data.hasSession} />

{#if animate}
	<main class="container mt-32" in:fly={flyOptions}>
		<h1 class="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
			<span class="block">Mastering job interviews</span>
			<span class="block">without the pressure</span>
		</h1>
		<p class="mx-auto mt-6 max-w-lg text-center text-xl text-foreground/80 sm:max-w-3xl">
			Practice CS/IT related job interview scenarios and get instant transcriptions and feedback.
			Your practice, your privacy.
		</p>
		<div class="mt-12 flex items-center justify-center space-x-4">
			<Button size="lg" href="/sign-up">Get Started</Button>
			<Button class="group" size="lg" variant="outline" href="/demo"
				>Try it Out
				<ArrowRight class="ml-2 size-4 transition group-hover:translate-x-2" />
			</Button>
		</div>
	</main>
{/if}
