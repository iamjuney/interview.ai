<script lang="ts">
	import { Badge, Collapsible } from '$lib/components';
	import type { Interview, Question } from '$lib/types';
	import { ArrowLeft, Inbox, Timer, PlayCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);
	let questionsIsOpen = $state(false);

	const questions = data.res.questions as Question[];

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
				<a href="/app/interviews" class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back to all interviews</p>
				</a>
			</div>
		</div>

		<div class="flex flex-col md:w-7/12">
			<!-- <div class="mb-2"><Badge class="capitalize">In-Progress</Badge></div> -->
			<h1 class="mb-2 mt-5 text-2xl font-semibold md:mt-0">
				{data.res?.position ?? 'Interview Title'}
			</h1>
			<div class="-ml-4 flex flex-wrap items-center">
				<div
					class="mb-5 flex h-4 items-center whitespace-nowrap border-r px-4 leading-none last:border-r-0"
				>
					<Inbox size="16" class="text-accent" />
					<span class="ml-2">{questions?.length} questions</span>
				</div>
				<div
					class="mb-5 flex h-4 items-center whitespace-nowrap border-r px-4 leading-none last:border-r-0"
				>
					<Timer size="16" class="text-accent" />
					<span class="ml-2">about {questions?.length * 2} minutes</span>
				</div>
			</div>
			<div class="mb-4 font-normal">
				{data.res?.description ?? 'No description provided.'}
			</div>
		</div>

		<div class="w-full md:w-7/12">
			<div class="mb-5 mt-1">
				<div class="text-lg font-semibold">Possible Questions</div>
			</div>
			<Collapsible.Root
				open={questionsIsOpen}
				onOpenChange={() => (questionsIsOpen = !questionsIsOpen)}
			>
				{#each questions.slice(0, 5) as question}
					<a
						class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
						href="/app/interviews/samplequestion"
						><div class="flex items-center text-left">
							<PlayCircle size="20" class="flex-none text-accent" />
							<div class="ml-3 grow">{question.question}</div>
						</div>
					</a>
				{/each}
				<Collapsible.Content>
					{#each questions.slice(5) as question}
						<a
							class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
							href="/app/interviews/samplequestion"
							><div class="flex items-center text-left">
								<PlayCircle size="20" class="flex-none text-accent" />
								<div class="ml-3 grow">{question.question}</div>
							</div>
						</a>
					{/each}
				</Collapsible.Content>
				<Collapsible.Trigger class="text-sm font-semibold text-accent underline">
					{#if questionsIsOpen}
						Show less
					{:else}
						Show all 10 questions
					{/if}
				</Collapsible.Trigger>
			</Collapsible.Root>
		</div>
	</div>
{/if}
