<script lang="ts">
	import {
		Button,
		FeaturesSection,
		Footer,
		GetStartedSection,
		Header,
		SecondaryFeaturesSection,
		TestimonialsSection
	} from '$lib/components';
	import { Play } from 'lucide-svelte';
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
	<main in:fly={flyOptions}>
		<div class="container pb-16 pt-20 text-center lg:pt-32">
			<h1 class="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight sm:text-7xl">
				Mastering
				<span class="relative whitespace-nowrap text-primary"
					><svg
						aria-hidden="true"
						viewBox="0 0 418 42"
						class="absolute left-0 top-2/3 h-[0.58em] w-full fill-primary/50"
						preserveAspectRatio="none"
						><path
							d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
						></path></svg
					><span class="relative">job interviews</span></span
				>
				without the pressure.
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-muted-foreground">
				Practice CS/IT related job interview scenarios and get instant feedback and speech
				assessment. Your practice, your privacy.
			</p>
			<div class="mt-10 flex justify-center gap-x-6">
				<Button size="lg" variant="solid" href="/sign-up">Get Started</Button>
				<Button size="lg" variant="outline" href="/">
					<Play class="mr-2 size-4" />
					Watch demo
				</Button>
			</div>
			<div class="mt-36 lg:mt-44">
				<p class="text-base font-medium text-muted-foreground">
					<span
						>This is a thesis project of
						<a class="underline" href="https://www.linkedin.com/in/aljon-lerios/">Aljon Lerios</a> for
						the degree of BSCS.
					</span>
				</p>
				<ul role="list" class="mt-8 flex items-center justify-center">
					<li>
						<ul
							role="list"
							class="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
						>
							<li class="flex">
								<img
									alt="Mirage"
									loading="lazy"
									width="138"
									height="48"
									decoding="async"
									data-nimg="1"
									style="color:transparent"
									src="/assets/vsu.png"
								/>
							</li>
							<li class="flex">
								<img
									alt="Laravel"
									loading="lazy"
									width="136"
									height="48"
									decoding="async"
									data-nimg="1"
									style="color:transparent"
									src="/assets/vsu.png"
								/>
							</li>
							<li class="flex">
								<img
									alt="Statamic"
									loading="lazy"
									width="147"
									height="48"
									decoding="async"
									data-nimg="1"
									style="color:transparent"
									src="/assets/vsu.png"
								/>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>

		<!-- <FeaturesSection />

		<SecondaryFeaturesSection />

		<GetStartedSection />

		<TestimonialsSection /> -->
	</main>

	<Footer />
{/if}
