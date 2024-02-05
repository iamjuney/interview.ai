<script lang="ts">
	import { enhance } from '$app/forms';
	import { AlertDialog, Badge, Button, Collapsible } from '$lib/components';
	import type { Question } from '$lib/types';
	import { ArrowLeft, Inbox, PlayCircle, Timer } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let questions = $derived<Question[]>(data.res.questions);
	let questionsCount = $derived<number>(questions.length);
	let animate = $state(false);
	let questionsIsOpen = $state(false);

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
				<a href="/app/interviews" class="group flex items-center gap-2" data-sveltekit-preload-data>
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back to all interviews</p>
				</a>
			</div>
		</div>

		<div class="flex w-full flex-col gap-3 md:flex-row md:justify-between">
			<div class="flex flex-col md:w-7/12">
				<div class="mb-2">
					<Badge class="capitalize">{data.status}</Badge>
				</div>
				<h1 class="mb-2 mt-5 text-2xl font-semibold md:mt-0">
					{data.res.position} at {data.res.company}
				</h1>
				<div class="-ml-4 flex flex-wrap items-center">
					<div
						class="mb-5 flex h-4 items-center whitespace-nowrap border-r px-4 leading-none last:border-r-0"
					>
						<Inbox size="16" class="text-accent" />
						<span class="ml-2">{questionsCount} questions</span>
					</div>
					<div
						class="mb-5 flex h-4 items-center whitespace-nowrap border-r px-4 leading-none last:border-r-0"
					>
						<Timer size="16" class="text-accent" />
						<span class="ml-2">about {questionsCount * 2} minutes</span>
					</div>
				</div>
				<div class="mb-4 font-normal">
					{data.res?.description ?? 'No description provided.'}
				</div>
			</div>

			<div class="mt-4">
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button size="lg" variant="destructive">Delete Interview</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently <strong>delete</strong> this interview
								and all your progress will be lost.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form action="/app/interviews?/delete" use:enhance method="post">
								<input type="hidden" name="user_interview_id" value={data.id} />
								<AlertDialog.Action
									type="submit"
									class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
									>Continue</AlertDialog.Action
								>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>

		<div class="w-full md:w-7/12">
			<div class="mb-5 mt-1">
				<div class="text-lg font-semibold">Technical Questions</div>
			</div>
			<Collapsible.Root
				open={questionsIsOpen}
				onOpenChange={() => (questionsIsOpen = !questionsIsOpen)}
			>
				{#each questions.slice(0, questionsCount / 2) as question}
					<a
						class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
						href="/app/questions/{question.slug}"
						><div class="flex items-center text-left">
							<PlayCircle size="20" class="flex-none text-accent" />
							<div class="ml-3 grow">{question.question}</div>
						</div>
					</a>
				{/each}
				<Collapsible.Content>
					{#each questions.slice(questionsCount / 2) as question}
						<a
							class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
							href="/app/questions/{question.slug}"
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
						Show all {questionsCount} questions
					{/if}
				</Collapsible.Trigger>
			</Collapsible.Root>
		</div>
	</div>
{/if}
