<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { AlertDialog, Button, Input, Label, Select, Textarea } from '$lib/components';
	import type { Question } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, Loader2, Pencil, Trash, XCircle } from 'lucide-svelte';
	import slugify from 'slugify';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let interview = $state(data.interviewDetails);
	let animate = $state(false);
	let questions = $derived<Question[]>(data.questions);
	let isUpdateInterviewSubmitting = $state(false);
	let isDeleteQuestionSubmitting = $state(false);
	let failedUpdateInterview = $state<Record<string, any>>();

	let position = $state(interview.position);
	let interviewSlug = $derived(slugGenerator(position));
	let description = $state(interview.description);
	let difficulty = $state({ value: interview.difficulty, label: interview.difficulty });
	let duration = $state(interview.duration);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	const handleUpdateInterviewSubmit: SubmitFunction = async () => {
		isUpdateInterviewSubmitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				failedUpdateInterview = result.data;
				isUpdateInterviewSubmitting = false;
				return;
			}
			await applyAction(result);
		};
	};

	function slugGenerator(str: string) {
		return slugify(str, {
			lower: true,
			strict: true
		});
	}
</script>

{#snippet questionCard(q: Question)}
	<div
		class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium"
	>
		<div class="flex w-full items-center justify-between gap-3 text-left">
			<div class="grid grid-flow-col gap-2">
				<Button
					href="/admin/interviews/{interview.interviewSlug}/questions/{q.slug}"
					class="hover:opacity-90"
					size="icon"
					title="Edit Question"
				>
					<Pencil class="size-4" />
				</Button>
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button
							class="group cursor-pointer"
							variant="destructive"
							size="icon"
							title="Delete Question"
						>
							<Trash class="size-4" />
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently <strong>delete</strong> this question
								and all the data will be lost.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form
								action="/admin/questions?/delete"
								use:enhance={() => {
									isDeleteQuestionSubmitting = true;
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
								<input type="hidden" name="question_id" value={q.id} />
								<AlertDialog.Action
									type="submit"
									class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
									bind:disabled={isDeleteQuestionSubmitting}>Continue</AlertDialog.Action
								>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
			<div class="grow">{q.question}</div>
		</div>
	</div>
{/snippet}

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a
					href="/admin/interviews"
					class="group flex items-center gap-2"
					data-sveltekit-preload-data
				>
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to interviews</p>
				</a>
			</div>
		</div>

		<h1 class="truncate text-3xl font-medium tracking-tight">Edit Interview</h1>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Interview Details</h2>
			<p class="text-muted-foreground">Edit the details of the interview below.</p>

			{#if failedUpdateInterview}
				<div class="flex items-center justify-center text-destructive">
					<XCircle class="mr-2 size-4 " />
					<span class="text-sm">{failedUpdateInterview.message}</span>
				</div>
			{/if}

			<form
				class="max-w-xl"
				action="/admin/interviews?/updateInterview"
				method="post"
				use:enhance={handleUpdateInterviewSubmit}
			>
				<input
					type="hidden"
					id="interview_id"
					name="interview_id"
					value={data.interviewDetails.id}
				/>

				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="position">Position</Label>
						<Input id="position" name="position" bind:value={position} required />
					</div>

					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="interview_slug">Interview Slug (Auto-generated)</Label>
						<Input
							id="interview_slug"
							name="interview_slug"
							value={interviewSlug}
							required
							disabled
						/>
					</div>
				</div>

				<div class="mt-6 grid gap-3">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						class="min-h-32"
						name="description"
						value={description}
						required
					/>
				</div>

				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="difficulty">Difficulty</Label>
						<Select.Root required selected={difficulty}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Choose Difficulty" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="Basic">Basic</Select.Item>
								<Select.Item value="Intermediate">Intermediate</Select.Item>
								<Select.Item value="Advanced">Advanced</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="duration">Duration (estimate in mins.)</Label>
						<Input type="number" id="duration" name="duration" value={duration} required />
					</div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg" bind:disabled={isUpdateInterviewSubmitting}>
						{#if isUpdateInterviewSubmitting}
							<span class="flex items-center space-x-2">
								<span>Saving...</span>
								<Loader2 class="size-4 animate-spin" />
							</span>
						{:else}
							<span>Save Changes</span>
						{/if}
					</Button>
				</div>
			</form>
		</div>

		<div class="w-full md:w-7/12">
			<div class="mb-5 mt-1">
				<div class="text-lg font-semibold">Questions</div>
				<p class="text-muted-foreground">
					These are the questions that will be asked in the interview. You can edit or delete them
					below.
				</p>
			</div>
			{#each questions as question}
				{@render questionCard(question)}
			{/each}
		</div>
	</div>
{/if}
