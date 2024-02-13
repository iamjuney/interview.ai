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
	<section class="relative overflow-hidden" in:fly={flyOptions}>
		<div
			class="relative mx-auto mb-16 mt-24 grid max-w-5xl grid-cols-8 gap-6 px-6 pt-10 md:grid-cols-12"
		>
			<div
				class="col-span-8 flex flex-col items-center gap-10 text-center sm:col-span-6 sm:col-start-2 md:col-span-8 md:col-start-3"
			>
				<div>
					<h1
						class="mb-6 text-4xl font-semibold md:text-5xl"
						id="heading-1-overview"
						aria-label="Mastering job interviews without the pressure"
					>
						Mastering job interviews without the pressure
					</h1>
					<p class="text-base md:text-lg">
						Practice CS/IT related job interview scenarios and get instant transcriptions and
						feedback. Your practice, your privacy.
					</p>
				</div>
				<div class="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
					<Button size="lg" href="/sign-up">Get Started</Button>
					<Button class="group" size="lg" variant="outline" href="/demo"
						>Try it Out
						<ArrowRight class="ml-2 size-4 transition group-hover:translate-x-2" />
					</Button>
				</div>
				<div class="inline-flex items-center gap-2 text-left">
					<span class="text-sm font-medium"
						>This is a thesis project of
						<a
							class="hover:text-slate-11 underline"
							href="https://www.linkedin.com/in/aljon-lerios/">Aljon Lerios</a
						>.
					</span>
				</div>
			</div>
		</div>
		<div class="relative max-w-5xl px-6 md:mx-auto">
			<div
				class="relative h-[75vh] max-h-[36rem] min-h-[28rem] sm:max-h-[42rem] md:aspect-[16/7] md:h-auto md:max-h-none md:min-h-0"
			>
				<div class="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
					<div
						class="border-sand-6 bg-sand-1 col-span-6 col-start-2 min-w-[40rem] overflow-hidden rounded-lg border sm:col-start-3 sm:min-w-[48rem] md:col-span-8 md:mb-12 md:min-w-0"
					>
						<img src="/assets/hero_1.webp" alt="" width="884" height="619" class="w-full" />
					</div>
				</div>
				<div class="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
					<div
						class="border-sand-6 bg-sand-1 col-span-6 col-start-1 mt-52 min-w-[40rem] overflow-hidden rounded-lg border sm:col-start-2 sm:min-w-[48rem] md:col-span-8 md:col-start-5 md:mt-12 md:min-w-0"
					>
						<img src="/assets/hero_2.webp" alt="" width="784" height="549" class="w-full" />
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
