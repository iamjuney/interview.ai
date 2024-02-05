<script lang="ts">
	import { Input } from '$lib/components';
	import { Search } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);

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
		<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<h2 class="text-3xl font-medium tracking-tight">My Questions</h2>
		</div>

		<div>
			<div class="w-full">
				<label for="search" class="sr-only">Search</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-0">
						<Search size="20" class="text-foreground/60" />
					</div>
					<Input id="search" class="border-0 pl-8 text-base" placeholder="Search" />
				</div>
			</div>

			<div class="mt-3 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{#if data.questions.length === 0}
					<p class="text-secondary">No questions found</p>
				{:else}
					{#each data.questions as question}
						<a
							class="group relative mb-2 flex h-full max-h-[200px] w-full items-start justify-between rounded-xl border border-accent p-4 font-medium transition duration-100"
							href="/app/questions/{question.slug}"
							><div
								class="absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"
							></div>
							<div class="relative flex h-full flex-col overflow-hidden">
								<div class="flex items-center text-left">
									<p>{question.question}</p>
								</div>
								<p class="mt-1 grow text-wrap text-sm font-normal text-foreground/80">
									{question.question}
								</p>
								<div class="flex flex-row space-x-2"></div>
							</div></a
						>
					{/each}
				{/if}

				<!-- <a
					class="group relative mb-2 flex h-full max-h-[200px] w-full items-start justify-between rounded-xl border border-accent p-4 font-medium transition duration-100"
					href="/app/questions"
					><div
						class="absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"
					></div>
					<div class="relative flex h-full flex-col overflow-hidden">
						<div class="flex items-center text-left"><p>Salary Expectation</p></div>
						<p class="mt-1 grow text-wrap text-sm font-normal text-foreground/80">
							What is your expected salary?
						</p>
						<div class="flex flex-row space-x-2">
							<p
								class="inline-flex items-center justify-center truncate rounded-full border border-[#D0E7DC] bg-[#F3FAF1] px-2 py-0.5 text-xs font-normal text-slate-700 hover:bg-[#edf8ea]"
							>
								<span class="mr-1 flex items-center text-emerald-600"
									><svg
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
											fill="#459A5F"
											stroke="#459A5F"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path><path
											d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
											stroke="#F4FAF4"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path></svg
									></span
								>Completed
							</p>
						</div>
					</div></a
				> -->
			</div>
		</div>
	</div>
{/if}
