<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Badge, Button, Input } from '$lib/components';
	import { type SubmitFunction } from '@sveltejs/kit';
	import { Check, Loader2, Search } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';

	let { data } = $props();
	let questions = $state(data.questions);
	let total = $derived<number | undefined>(data.total);
	let current = $state(Number($page.params.slug));
	let animate = $state(false);
	let searchForm = $state<HTMLFormElement>();
	let query = $state('');
	let timeoutId = $state<NodeJS.Timeout>();
	let isSearching = $state(false);
	let failedSearchData = $state<Record<string, any>>();
	let pagination = $derived(() => {
		return {
			total: total,
			per_page: 12,
			current_page: current,
			last_page: Math.ceil(questions.length / 12),
			from: (current - 1) * 12 + 1,
			to:
				Math.ceil((total ?? 0) / 12) === current
					? 12 * (current - 1) + questions.length
					: 12 * current
		};
	});

	$effect(() => {
		animate = true;
	});

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
			else if (result.type === 'success') questions = result.data?.questions;

			isSearching = false;
		};
	};
</script>

{#if animate}
	<div class="container flex grow flex-col space-y-12 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<h2 class="text-3xl font-medium tracking-tight">My Questions</h2>
		</div>

		<div class="grow">
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
							<Loader2 size="20" class="animate-spin text-muted-foreground" />
						{:else}
							<Search size="20" class="text-muted-foreground" />
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

			<div class="mt-3 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#if questions.length > 0}
					{#each questions as question}
						<a
							class="group relative mb-2 flex h-full max-h-[200px] w-full items-start justify-between rounded-xl border p-4 font-medium shadow-sm transition duration-100 hover:bg-secondary hover:text-secondary-foreground"
							href="/app/questions/{question.slug}"
							data-sveltekit-preload-data
						>
							<div class="relative flex h-full flex-col overflow-hidden">
								<div class="flex items-center text-left">
									<p>{question.question}</p>
								</div>
								<div class="mt-2 flex flex-row space-x-2">
									{#if question.answers && question.answers.length > 0}
										<Badge color="primary">
											<Check class="mr-1 size-3" />
											Answered
										</Badge>
									{/if}
								</div>
							</div></a
						>
					{/each}
				{:else}
					<p class="text-muted-foreground">No questions found.</p>
				{/if}
			</div>
		</div>

		<div class="pb-8">
			<nav
				class="flex items-center justify-between border-t px-4 py-[13px] sm:px-6"
				aria-label="Pagination"
			>
				<div class="hidden sm:block">
					<p class="text-sm">
						Showing <span class="font-medium">{pagination().from}</span> to
						<span class="font-medium">{pagination().to}</span>
						of
						<span class="font-medium">{total}</span> results
					</p>
				</div>
				<div class="flex flex-1 justify-between gap-3 sm:justify-end">
					{#if current === 1}
						<Button disabled>Previous</Button>
					{:else}
						<Button href="/app/questions/page/{current - 1}" data-sveltekit-reload>Previous</Button>
					{/if}

					{#if pagination().to === total}
						<Button disabled>Next</Button>
					{:else}
						<Button href="/app/questions/page/{current + 1}" data-sveltekit-reload>Next</Button>
					{/if}
				</div>
			</nav>
		</div>
	</div>
{/if}
