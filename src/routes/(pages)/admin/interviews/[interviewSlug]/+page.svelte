<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button, Input, Label, Textarea, Select } from '$lib/components';
	import type { Question } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, CheckCircle, Loader2, PlayCircle, XCircle } from 'lucide-svelte';
	import slugify from 'slugify';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let interview = $state(data.interviewDetails);
	let animate = $state(false);
	let questions = $derived<Question[]>(data.questions);
	let isUpdateInterviewSubmitting = $state(false);
	let failedUpdateInterview = $state<Record<string, any>>();

	let position = $state(interview.position);
	let interviewSlug = $derived(slugGenerator(position));
	let description = $state(interview.description);
	let difficulty = $state({ value: interview.difficulty, label: interview.difficulty });

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

{#snippet questionCard(q:Question)}
	<a
		class="mb-2 flex w-full items-center justify-between rounded-md border border-border p-3 font-medium transition-all duration-200 hover:ml-3"
		href="/admin/interviews/{$page.params.interviewSlug}"
	>
		<div class="flex items-center text-left">
			<CheckCircle size="20" class="flex-none text-green-500" />
			<PlayCircle size="20" class="flex-none text-primary" />
			<div class="ml-3 grow">{q.question}</div>
		</div>
	</a>
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
						<Label for="interview_slug">Interview Slug</Label>
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
						class="min-h-24"
						name="description"
						value={description}
						required
					/>
				</div>

				<div class="mt-6 grid gap-3">
					<Label for="difficulty">Difficulty</Label>
					<Select.Root required selected={difficulty}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Choose Difficulty" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="Basic">Basic</Select.Item>
							<Select.Item value="Intermediate">Intermediate</Select.Item>
							<Select.Item value="Advanced">Advanced</Select.Item>
						</Select.Content>
					</Select.Root>
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
			</div>
			{#each questions as question}
				{@render questionCard(question)}
			{/each}
		</div>
	</div>
{/if}
