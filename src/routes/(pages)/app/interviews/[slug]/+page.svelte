<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { afterNavigate, goto } from '$app/navigation';
	import { AlertDialog, Badge, Button, Collapsible } from '$lib/components';
	import type { Question } from '$lib/types';
	import { ArrowLeft, CheckCircle, CircleDot, Inbox, PlayCircle, Timer } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);
	let interview = $derived(data.interviewDetails);
	let userInterview = $derived(data.userInterviewDetails);
	let questions = $derived<Question[]>(data.questions);
	let questionsCount = $derived<number>(questions.length);
	let questionsIsOpen = $state(false);

	let previousPage = $state<string>('/app/interviews');
	let text = $state<string>('to my interviews');
	let isSubmitting = $state(false);

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;

		if (previousPage === '/app/interviews/browse') {
			text = 'to all interviews';
		}
	});

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};
</script>

{#snippet questionCardClickable(q:Question)}
	<a
		class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
		href="/app/questions/{q.slug}"
		><div class="flex items-center text-left">
			{#if q.answers!.length > 0}
				<CheckCircle size="20" class="flex-none text-accent" />
			{:else}
				<PlayCircle size="20" class="flex-none text-accent" />
			{/if}
			<div class="ml-3 grow">{q.question}</div>
		</div>
	</a>
{/snippet}

{#snippet questionCardNotClickable(q:Question)}
	<div class="flex w-full items-center justify-between p-3 font-medium transition-all duration-200">
		<div class="flex items-center text-left">
			<CircleDot size="20" class="flex-none text-accent" />
			<div class="ml-3 grow">{q.question}</div>
		</div>
	</div>
{/snippet}

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href={previousPage} class="group flex items-center gap-2" data-sveltekit-preload-data>
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back {text}</p>
				</a>
			</div>
		</div>

		<div class="flex w-full flex-col gap-3 md:flex-row md:justify-between">
			<div class="flex flex-col md:w-7/12">
				{#if userInterview}
					<div class="mb-2">
						<Badge class="capitalize">{userInterview.status}</Badge>
					</div>
				{/if}
				<h1 class="mb-2 mt-5 text-2xl font-semibold md:mt-0">
					{interview.position} at {interview.company}
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
					{interview?.description ?? 'No description provided.'}
				</div>
			</div>

			<div class="mt-4">
				{#if userInterview}
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button size="lg" variant="destructive" bind:disabled={isSubmitting}
								>Delete Interview</Button
							>
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
								<form
									action="/app/interviews?/delete"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ result }) => {
											if (result.type === 'redirect') {
												goto(result.location);
											} else {
												await applyAction(result);
											}
										};
									}}
									method="post"
								>
									<input type="hidden" name="user_interview_id" value={userInterview.id} />
									<AlertDialog.Action
										type="submit"
										class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
										bind:disabled={isSubmitting}>Continue</AlertDialog.Action
									>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{:else}
					<form
						action="/app/interviews?/add"
						method="post"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ result }) => {
								if (result.type === 'redirect') {
									goto(result.location);
								} else {
									await applyAction(result);
								}
							};
						}}
					>
						<input type="hidden" name="interview_id" value={interview.id} />
						<Button size="lg" type="submit" bind:disabled={isSubmitting}>Add Interview</Button>
					</form>
				{/if}
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
					{#if userInterview}
						{@render questionCardClickable(question)}
					{:else}
						{@render questionCardNotClickable(question)}
					{/if}
				{/each}
				<Collapsible.Content>
					{#each questions.slice(questionsCount / 2) as question}
						{#if userInterview}
							{@render questionCardClickable(question)}
						{:else}
							{@render questionCardNotClickable(question)}
						{/if}
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
