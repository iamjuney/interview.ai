<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Label, Input, Textarea } from '$lib/components';
	import type { Question } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, Loader2, XCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import slugify from 'slugify';
	import { CldUploadButton } from 'svelte-cloudinary';

	let { data } = $props();
	let animate = $state(false);
	let isUpdateQuestionSubmitting = $state(false);
	let failedUpdateQuestion = $state<Record<string, any>>();

	let question = $state(data.questionDetails.question);
	let slug = $derived(slugGenerator(question));
	let videoUrl = $state(data.questionDetails.videoUrl);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	const handleUpdateQuestionSubmit: SubmitFunction = async () => {
		isUpdateQuestionSubmitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				failedUpdateQuestion = result.data;
				isUpdateQuestionSubmitting = false;
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

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a
					href="/admin/interviews/{$page.params.interviewSlug}"
					class="group flex items-center gap-2"
					data-sveltekit-preload-data
				>
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to interview</p>
				</a>
			</div>
		</div>

		<h1 class="truncate text-3xl font-medium tracking-tight">Edit Question</h1>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Question Details</h2>
			<p class="text-muted-foreground">Edit the details of the question below.</p>

			{#if failedUpdateQuestion}
				<div class="flex items-center justify-center text-destructive">
					<XCircle class="mr-2 size-4 " />
					<span class="text-sm">{failedUpdateQuestion.message}</span>
				</div>
			{/if}

			<form
				class="max-w-xl"
				action="/admin/questions?/updateQuestion"
				method="post"
				use:enhance={handleUpdateQuestionSubmit}
			>
				<input type="hidden" id="question_id" name="question_id" value={data.questionDetails.id} />

				<div class="mt-6 grid gap-3">
					<Label for="question">Question</Label>
					<Textarea id="question" class="min-h-24" name="question" bind:value={question} required />
				</div>

				<div class="mt-6 grid gap-3">
					<Label for="slug">Slug (Auto-generated)</Label>
					<Textarea id="slug" class="min-h-24" name="slug" value={slug} required disabled />
				</div>

				<div class="mt-6 grid gap-3">
					<Label for="videoUrl">Video URL (Auto-generated)</Label>
					<div class="flex items-center justify-between gap-3">
						<Input class="grow" id="videoUrl" name="videoUrl" value={videoUrl} required disabled />
						<CldUploadButton
							class="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							uploadPreset="<Upload Preset>">Upload new video</CldUploadButton
						>
					</div>
					<div></div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg" bind:disabled={isUpdateQuestionSubmitting}>
						{#if isUpdateQuestionSubmitting}
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
	</div>
{/if}
