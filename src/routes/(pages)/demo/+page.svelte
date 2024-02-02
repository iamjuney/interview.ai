<script lang="ts">
	import { Button, InterviewStage, Logo, ToggleGroup } from '$lib/components';
	import { ArrowRight, Inbox, Timer } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);
	let step = $state(1);
	let selectedJob = $state('1');
	let selectedInterview = $state('1');
	let questions = ['Tell me about yourself. Why don’t you walk me through your resume?'];

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};
</script>

{#if step == 1}
	{#if animate}
		<div
			class="container mb-32 mt-12 flex max-w-5xl flex-col md:mt-32 md:flex-row"
			in:fly={flyOptions}
		>
			<div class="flex grow flex-col gap-6 md:pr-24">
				<Logo />
				<div class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
					Select a job position
				</div>
				<div class="text-lg">
					We offer a wide range of interview questions from leading tech companies. Begin by
					selecting a job position to begin your practice.
				</div>
			</div>
			<div class="mt-6 max-w-lg">
				<ToggleGroup.Root type="single" bind:value={selectedJob}>
					{#each data.jobPositions as jobPosition}
						<ToggleGroup.Item
							value={jobPosition.id}
							class="h-full cursor-pointer rounded-lg border-2 p-6 data-[state=on]:ring-4 data-[state=on]:ring-primary"
						>
							<div class="flex flex-col items-start gap-6 text-left">
								<span class="block text-xl font-bold tracking-tight sm:text-xl lg:text-2xl"
									>{jobPosition.title}</span
								><span class="mt-1 flex items-center text-sm">{jobPosition.description}</span>
							</div>
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</div>
	{/if}
{:else if step == 2}
	{#if animate}
		<div
			class="container mb-32 mt-12 flex max-w-5xl flex-col md:mt-32 md:flex-row"
			in:fly={flyOptions}
		>
			<div class="flex grow flex-col gap-6 md:pr-24">
				<Logo />
				<div class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
					Select an interview type
				</div>
				<div class="text-lg">
					We have hundreds of questions from top tech companies. Choose an interview type to get
					started.
				</div>
			</div>
			<div class="mt-6 max-w-lg">
				<ToggleGroup.Root type="single" bind:value={selectedInterview}>
					{#each data.sections as section}
						<ToggleGroup.Item
							value={section.id}
							class="h-full cursor-pointer rounded-lg border-2 p-6 data-[state=on]:ring-4 data-[state=on]:ring-primary"
						>
							<div class="flex flex-col items-start gap-6 text-left">
								<span class="block text-xl font-bold tracking-tight sm:text-xl lg:text-2xl"
									>{section.title}</span
								><span class="mt-1 flex items-center text-sm">{section.description}</span>
							</div>
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</div>
	{/if}
{:else if step == 3}
	{#if animate}
		<div class="container mb-32 mt-12 flex max-w-5xl flex-col md:mt-32" in:fly={flyOptions}>
			<h2 class="mb-4 text-left text-2xl font-semibold">
				{questions[0]}
			</h2>
			<InterviewStage {questions} />
		</div>
	{/if}
{/if}

<div class="fixed bottom-0 w-full px-4">
	<div class="container flex max-w-5xl justify-end gap-4 border-t py-6">
		{#if step == 1}
			<Button size="lg" href="/">Back to Home</Button>
		{:else}
			<Button
				size="lg"
				on:click={() => {
					step--;
				}}>Previous</Button
			>
		{/if}

		{#if step < 3}
			<Button
				class="group"
				size="lg"
				variant="outline"
				on:click={() => {
					step++;
				}}
				disabled={selectedJob == null || selectedInterview == null}
			>
				Next
				<ArrowRight class="ml-2 size-4 transition group-hover:translate-x-2" />
			</Button>
		{/if}
	</div>
</div>
