<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, InterviewCard, Progress } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, Loader2, Search, Timer, Inbox } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let interviews = $state(data.interviews);
	let animate = $state(false);
	let searchForm = $state<HTMLFormElement>();
	let query = $state('');
	let timeoutId = $state<NodeJS.Timeout>();
	let isSearching = $state(false);
	let failedSearchData = $state<Record<string, any>>();

	$effect(() => {
		animate = true;
	});

	// fly transition options
	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	// debounce function
	const debounce = (func: () => void, wait: number | undefined) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(func, wait);
	};

	// handle the input event
	const handleInput = () => {
		// debounce the input event every 300ms
		if (query.length > 0) {
			debounce(() => {
				searchForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
			}, 300);
		}
	};

	// handle the form submission
	const handleSubmit: SubmitFunction = () => {
		isSearching = true;

		return ({ result }) => {
			// if the result is a failure, set the failedSearchData to the result data
			// else, set the interviews to the result data
			if (result.type === 'failure') failedSearchData = result.data;
			else if (result.type === 'success') interviews = result.data?.interviews;

			isSearching = false;
		};
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
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">Select Interview</h2>
				<!-- <Button size="lg" href="/app/interviews/browse">Create Custom Interview</Button> -->
			</div>
		</div>

		<div>
			<form
				bind:this={searchForm}
				class="w-full"
				use:enhance={handleSubmit}
				action="?/search"
				method="post"
			>
				<label for="query" class="sr-only">Search</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-0">
						{#if isSearching}
							<Loader2 size="20" class="animate-spin text-foreground/60" />
						{:else}
							<Search size="20" class="text-foreground/60" />
						{/if}
					</div>
					<Input
						bind:value={query}
						oninput={handleInput}
						id="query"
						name="query"
						class="max-w-sm border-0 pl-8 text-base"
						placeholder="Search"
					/>
				</div>
			</form>

			{#if failedSearchData}
				<p class="text-secondary">{failedSearchData.message}</p>
			{/if}

			<div
				class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#if interviews.length === 0}
					<p class="text-secondary">No interviews found.</p>
				{:else}
					{#each interviews as interview}
						<!-- <InterviewCard {interview} addToUserInterviews={true} /> -->
						<div
							class="group relative cursor-pointer rounded-xl border p-4 shadow hover:bg-secondary"
						>
							<form action="/app/interviews?/add" method="post" use:enhance>
								<input type="hidden" name="interview_id" value={interview.id} />
								<input type="hidden" name="interview_slug" value={interview.slug} />

								<button
									type="submit"
									class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg shadow"
								>
									<div class="relative h-full w-full rounded-lg bg-white">
										<div
											class="absolute bottom-2 left-4 right-4 top-4 flex flex-col items-start gap-3"
										>
											<div class="flex flex-row items-center">
												<div class="h-4 w-[2px] bg-primary-foreground"></div>
												<p class="ml-2 font-semibold text-primary-foreground">
													{interview.company}
												</p>
											</div>
											<p class="text-2xl font-semibold text-primary-foreground">
												{interview.position}
											</p>
											<Progress value={2} class="mt-6" />
											<p class="text-sm text-primary-foreground">Not Yet Started</p>
										</div>
									</div>
								</button>
								<button type="submit">
									<div class="mb-2 flex items-center space-x-2 font-medium">
										<span class="flex items-center">
											<Inbox class="mr-2 size-4 text-primary" />
											{interview.questions.length} questions
										</span>
										<span class="flex items-center">
											<Timer class="mr-2 size-4 text-primary" />
											about {interview.questions.length * 2} minutes
										</span>
									</div>
									<div class="mt-4 text-start">
										<p class="w-full font-medium">Description</p>
										<p class="mt-1 line-clamp-4 text-sm font-normal text-foreground/80">
											{interview.description}
										</p>
									</div>
								</button>
							</form>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
