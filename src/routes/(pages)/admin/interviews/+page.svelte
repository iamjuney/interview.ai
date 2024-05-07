<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { AlertDialog, Button, Input, NotFound, DropdownMenu } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Inbox, Loader2, Pencil, Search, Timer, Trash, ListFilter } from 'lucide-svelte';
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
	let isSubmitting = $state(false);
	let selectedFilter = $state<string>('All');

	$effect(() => {
		animate = true;
	});

	$effect(() => {
		if (query.length === 0) {
			if (selectedFilter === 'All') {
				interviews = data.interviews;
			} else {
				interviews = data.interviews.filter((interview) => interview.difficulty === selectedFilter);
			}
		} else {
			if (selectedFilter === 'All') {
				interviews = data.interviews.filter((interview) =>
					interview.position.toLowerCase().includes(query.toLowerCase())
				);
			} else {
				interviews = data.interviews.filter(
					(interview) =>
						interview.position.toLowerCase().includes(query.toLowerCase()) &&
						interview.difficulty === selectedFilter
				);
			}
		}
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
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">Interviews</h2>
				<Button size="lg" href="/admin/interviews">Create Custom Interview</Button>
			</div>
		</div>

		<div class="h-full">
			<div class="flex items-center justify-between gap-3">
				<form
					bind:this={searchForm}
					class="w-full"
					use:enhance={handleSubmit}
					action="?/search"
					method="post"
				>
					<label for="query" class="sr-only">Search</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
							class="max-w-sm border-0 bg-transparent pl-12 text-base"
							placeholder="Search"
						/>
					</div>
				</form>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
							<ListFilter class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Filter</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Filter by Difficulty</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.CheckboxItem
							checked={selectedFilter === 'All'}
							onCheckedChange={() => {
								selectedFilter = 'All';
							}}>All</DropdownMenu.CheckboxItem
						>
						<DropdownMenu.CheckboxItem
							checked={selectedFilter === 'Basic'}
							onCheckedChange={() => {
								selectedFilter = 'Basic';
							}}>Basic</DropdownMenu.CheckboxItem
						>
						<DropdownMenu.CheckboxItem
							checked={selectedFilter === 'Intermediate'}
							onCheckedChange={() => {
								selectedFilter = 'Intermediate';
							}}>Intermediate</DropdownMenu.CheckboxItem
						>
						<DropdownMenu.CheckboxItem
							checked={selectedFilter === 'Advanced'}
							onCheckedChange={() => {
								selectedFilter = 'Advanced';
							}}>Advanced</DropdownMenu.CheckboxItem
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			{#if failedSearchData}
				<p class="text-muted-foreground">{failedSearchData.message}</p>
			{/if}

			{#if interviews.length === 0}
				<NotFound message="No interviews found." />
			{:else}
				<div
					class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
				>
					{#each interviews as interview}
						<div class="relative rounded-xl border p-4 shadow-sm transition duration-100">
							<div
								class="relative z-10 mb-4 grid min-h-32 w-full flex-shrink-0 place-items-center rounded-lg shadow-sm"
							>
								<div class="relative h-full w-full rounded-lg border bg-primary/10">
									<div class="absolute right-4 top-4 z-20 flex gap-2">
										<Button
											href="/admin/interviews/{interview.interviewSlug}"
											class="hover:opacity-90"
											size="icon"
											title="Edit Interview"
										>
											<Pencil class="size-4" />
										</Button>
										<AlertDialog.Root>
											<AlertDialog.Trigger>
												<Button
													class="group cursor-pointer"
													variant="destructive"
													size="icon"
													title="Delete Interview"
												>
													<Trash class="size-4" />
												</Button>
											</AlertDialog.Trigger>
											<AlertDialog.Content>
												<AlertDialog.Header>
													<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
													<AlertDialog.Description>
														This action cannot be undone. This will permanently <strong
															>delete</strong
														> this interview and all the data will be lost.
													</AlertDialog.Description>
												</AlertDialog.Header>
												<AlertDialog.Footer>
													<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
													<form
														action="/admin/interviews?/delete"
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
														<input type="hidden" name="interview_id" value={interview.id} />
														<AlertDialog.Action
															type="submit"
															class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
															bind:disabled={isSubmitting}>Continue</AlertDialog.Action
														>
													</form>
												</AlertDialog.Footer>
											</AlertDialog.Content>
										</AlertDialog.Root>
									</div>
									<div class="absolute bottom-2 left-4 right-4 top-8 flex flex-col gap-3">
										<div class="flex flex-row items-center">
											<div class="h-4 w-[2px] bg-primary"></div>
											<p class="ml-2 font-semibold">{interview.difficulty}</p>
										</div>
										<p class="text-xl font-semibold">{interview.position}</p>
									</div>
								</div>
							</div>
							<div>
								<div class="mb-2 flex items-center space-x-2 text-sm font-medium lg:text-base">
									<span class="flex items-center">
										<Inbox class="mr-2 size-4 text-primary" />
										{interview.questions.length} questions
									</span>
									<span class="flex items-center">
										<Timer class="mr-2 size-4 text-primary" />
										about {interview.duration} minutes
									</span>
								</div>
								<div class="mt-4 items-center">
									<p class="w-full text-sm font-medium lg:text-base">Description</p>
									<p class="mt-1 line-clamp-3 text-sm font-normal text-foreground/80">
										{interview.description}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
