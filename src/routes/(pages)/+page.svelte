<script lang="ts">
	import { Button, Footer, Header } from '$lib/components';
	import { ArrowRight, Check } from 'lucide-svelte';
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
		<div class="container relative">
			<div class="mb-16 mt-32 grid grid-cols-8 gap-6 md:grid-cols-12">
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
							Practice CS/IT related job interview scenarios and get instant feedback and speech
							assessment. Your practice, your privacy.
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
		</div>
		<div class="container relative">
			<div
				class="relative h-[75vh] max-h-[36rem] min-h-[28rem] sm:max-h-[42rem] md:aspect-[16/7] md:h-auto md:max-h-none md:min-h-0"
			>
				<div class="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
					<div
						class="col-span-6 col-start-2 min-w-[40rem] overflow-hidden rounded-lg border sm:col-start-3 sm:min-w-[48rem] md:col-span-8 md:mb-12 md:min-w-0"
					>
						<img src="/assets/hero_1.webp" alt="" width="884" height="619" class="w-full" />
					</div>
				</div>
				<div class="absolute left-0 top-0 grid h-full w-full grid-cols-8 gap-6 md:grid-cols-12">
					<div
						class="col-span-6 col-start-1 mt-52 min-w-[40rem] overflow-hidden rounded-lg border sm:col-start-2 sm:min-w-[48rem] md:col-span-8 md:col-start-5 md:mt-12 md:min-w-0"
					>
						<img src="/assets/hero_2.webp" alt="" width="784" height="549" class="w-full" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="my-16 w-full bg-primary bg-opacity-25 px-5 md:px-0">
		<div class="mx-auto max-w-xl py-8 text-center">
			<p class="mb-4 text-base text-foreground/80 md:text-lg">Made for Computer Science Students</p>
			<div
				class="grid grid-cols-3 items-center gap-x-6 md:flex md:flex-row md:justify-between md:gap-x-0"
			>
				<img
					src="/assets/vsu.png"
					alt=""
					class="relative top-[1px] mx-auto w-[140px] place-items-center items-center md:h-full md:w-[120px]"
				/><img
					src="/assets/vsu.png"
					alt=""
					class="relative top-[2px] mx-auto w-[140px] place-items-center items-center md:h-full md:w-[120px]"
				/><img
					src="/assets/vsu.png"
					alt=""
					class="relative top-[-1px] mx-auto w-[140px] place-items-center items-center md:h-full md:w-[120px]"
				/>
			</div>
		</div>
	</div>

	<div class="relative overflow-hidden">
		<div class="container relative">
			<div class="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
				<div class="relative">
					<h3 class="text-3xl font-semibold">High Quality Feedback</h3>
					<p class="mt-3">
						Practice is the key to success. We’ve designed the practice process to be as simple as
						possible, and built custom transcription and AI integrations to provide you with helpful
						feedback.
					</p>

					<dl class="mt-10 space-y-10">
						<div class="relative">
							<dt>
								<div
									class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
								>
									<Check class="size-6" />
								</div>
								<p class="ml-16 text-lg font-semibold leading-6">User Friendly Interface</p>
							</dt>
							<dd class="ml-16 mt-2 text-base text-foreground/80">
								An environment that mimics real-life.
							</dd>
						</div>

						<div class="relative">
							<dt>
								<div
									class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
								>
									<Check class="size-6" />
								</div>
								<p class="ml-16 text-lg font-semibold leading-6">Smart-AI feedback</p>
							</dt>
							<dd class="ml-16 mt-2 text-base text-foreground/80">
								Receive relevant improvement tips.
							</dd>
						</div>

						<div class="relative">
							<dt>
								<div
									class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
								>
									<Check class="size-6" />
								</div>
								<p class="ml-16 text-lg font-semibold leading-6">Progress tracking</p>
							</dt>
							<dd class="ml-16 mt-2 text-base text-foreground/80">
								Monitor your performance over time.
							</dd>
						</div>
					</dl>
				</div>

				<div class="relative -mx-4 mt-10 lg:mt-0" aria-hidden="true">
					<img class="relative mx-auto w-full" src="/assets/hero_1.webp" alt="" />
				</div>
			</div>

			<div class="relative mt-12 sm:mt-16 lg:mt-24">
				<div class="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-12">
					<div class="lg:col-start-2">
						<h3 class="text-2xl font-semibold">Integrated Speech Assessment</h3>
						<p class="mt-3">
							Practice is the key to success. We’ve designed the practice process to be as simple as
							possible, and built custom transcription and AI integrations to provide you with
							helpful feedback.
						</p>

						<dl class="mt-10 space-y-10">
							<div class="relative">
								<dt>
									<div
										class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
									>
										<Check class="size-6" />
									</div>
									<p class="ml-16 text-lg font-semibold leading-6">User Friendly Interface</p>
								</dt>
								<dd class="ml-16 mt-2 text-base text-foreground/80">
									An environment that mimics real-life.
								</dd>
							</div>

							<div class="relative">
								<dt>
									<div
										class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
									>
										<Check class="size-6" />
									</div>
									<p class="ml-16 text-lg font-semibold leading-6">Smart-AI feedback</p>
								</dt>
								<dd class="ml-16 mt-2 text-base text-foreground/80">
									Receive relevant improvement tips.
								</dd>
							</div>

							<div class="relative">
								<dt>
									<div
										class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
									>
										<Check class="size-6" />
									</div>
									<p class="ml-16 text-lg font-semibold leading-6">Progress tracking</p>
								</dt>
								<dd class="ml-16 mt-2 text-base text-foreground/80">
									Monitor your performance over time.
								</dd>
							</div>
						</dl>
					</div>

					<div class="relative -mx-4 mt-10 lg:col-start-1 lg:mt-0">
						<img class="relative mx-auto w-full" src="/assets/hero_1.webp" alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<Footer />
{/if}
