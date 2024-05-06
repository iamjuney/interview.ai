<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, NotFound } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { CheckCircle, FileQuestion, Gauge, Loader2, Search } from 'lucide-svelte';
	import { CldImage } from 'svelte-cloudinary';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let users = $state(data.users);
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
			else if (result.type === 'success') users = result.data?.users;

			isSearching = false;
		};
	};
</script>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">Users</h2>
			</div>
		</div>

		<div class="h-full">
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
				<p class="text-muted-foreground">{failedSearchData.message}</p>
			{/if}

			{#if users.length === 0}
				<NotFound message="No interviews found." />
			{:else}
				<div
					class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
				>
					{#each users as user}
						<a
							href="/admin/users/{user.id}"
							data-sveltekit-preload-data
							class="group relative cursor-pointer rounded-xl border p-4 shadow-sm transition duration-100 hover:bg-accent md:border-0 md:shadow-none"
						>
							<div
								class="relative z-10 mb-4 grid min-h-32 w-full flex-shrink-0 place-items-center rounded-lg shadow-sm"
							>
								<div class="relative h-full w-full rounded-lg border bg-primary/10">
									<div class="absolute right-4 top-4 z-20 size-12">
										{#if user.image}
											{#if user.image.includes('github')}
												<img
													class="size-12 rounded-full"
													src={user.image}
													alt="Photo of {user.first_name} {user.last_name}"
												/>
											{:else}
												<CldImage
													src={user.image}
													crop="fill"
													width={48 * 4}
													height={48 * 4}
													sizes="100vw"
													alt="Photo of {user.first_name} {user.last_name}"
												/>
											{/if}
										{:else}
											<img src="/assets/poddle.webp" alt="avatar" class="size-12 rounded-full" />
										{/if}
									</div>
									<div class="absolute bottom-2 left-4 right-4 top-8 flex flex-col gap-3">
										<p class="text-xl font-semibold">{user.first_name} {user.last_name}</p>
										<div class="flex flex-row items-center">
											<div class="h-4 w-[2px] bg-primary"></div>
											<p class="ml-2 text-muted-foreground">{user.email}</p>
										</div>
									</div>
								</div>
							</div>
							<div>
								<div class="mb-2 flex flex-col items-start space-y-2 text-sm lg:text-base">
									<span class="flex items-center">
										<CheckCircle class="mr-2 size-4 text-primary" />
										12 completed interviews
									</span>
									<span class="flex items-center">
										<FileQuestion class="mr-2 size-4 text-primary" />
										34 answered questions
									</span>
									<span class="flex items-center">
										<Gauge class="mr-2 size-4 text-primary" />
										98 average pronunciation score
									</span>
								</div>
							</div>
							<div class="mt-4 flex items-center space-x-2 text-sm font-medium lg:text-base">
								<span class="flex items-center">
									<div class="text-primary group-hover:text-secondary-foreground">View more</div>
								</span>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
