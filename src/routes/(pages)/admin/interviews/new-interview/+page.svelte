<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Input, Label, Select, Textarea } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, Loader2, XCircle } from 'lucide-svelte';
	import slugify from 'slugify';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let animate = $state(false);
	let isNewInterviewSubmitting = $state(false);
	let failedNewInterview = $state<Record<string, any>>();

	let position = $state('');
	let interviewSlug = $derived(slugGenerator(position));

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	const handleNewInterviewSubmit: SubmitFunction = async () => {
		isNewInterviewSubmitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				failedNewInterview = result.data;
				isNewInterviewSubmitting = false;
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
					href="/admin/interviews"
					class="group flex items-center gap-2"
					data-sveltekit-preload-data
				>
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to all interviews</p>
				</a>
			</div>
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">Add New Interview</h2>
			</div>
		</div>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Interview Details</h2>
			<p class="text-muted-foreground">Enter the details of the interview below.</p>

			{#if failedNewInterview}
				<div class="flex items-center justify-center text-destructive">
					<XCircle class="mr-2 size-4 " />
					<span class="text-sm">{failedNewInterview.message}</span>
				</div>
			{/if}

			<form
				class="max-w-xl"
				action="/admin/interviews?/add"
				method="post"
				use:enhance={handleNewInterviewSubmit}
			>
				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="position">Position</Label>
						<Input
							id="position"
							name="position"
							bind:value={position}
							placeholder="Enter job position title"
							required
						/>
					</div>

					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="interview_slug">Interview Slug (Auto-generated)</Label>
						<Input
							id="interview_slug"
							name="interview_slug"
							value={interviewSlug}
							placeholder="Auto-generated"
							required
							readonly
						/>
					</div>
				</div>

				<div class="mt-6 grid gap-3">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						class="min-h-32"
						name="description"
						placeholder="Enter job description"
						required
					/>
				</div>

				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="difficulty">Difficulty</Label>
						<Select.Root required>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Choose Difficulty" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="Basic">Basic</Select.Item>
								<Select.Item value="Intermediate">Intermediate</Select.Item>
								<Select.Item value="Advanced">Advanced</Select.Item>
							</Select.Content>
							<Select.Input name="difficulty" />
						</Select.Root>
					</div>

					<div class="col-span-12 grid gap-3 sm:col-span-6">
						<Label for="duration">Duration (estimate in mins.)</Label>
						<Input
							min="1"
							type="number"
							id="duration"
							name="duration"
							placeholder="Enter the estimated duration"
							required
						/>
					</div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg" bind:disabled={isNewInterviewSubmitting}>
						{#if isNewInterviewSubmitting}
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
