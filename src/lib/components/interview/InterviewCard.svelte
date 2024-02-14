<script lang="ts">
	import { Badge, Progress } from '$lib/components';
	import type { Interview, Question } from '$lib/types';
	import { Inbox, Timer } from 'lucide-svelte';

	let { interview, status } = $props<{ interview: Interview; status?: string | null }>();

	const questions = interview.questions as Question[];
</script>

<a
	href="/app/interviews/{interview.slug}"
	data-sveltekit-preload-data
	class="group relative cursor-pointer rounded-xl border p-4 shadow hover:bg-secondary hover:text-secondary-foreground"
>
	<div
		class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg shadow"
	>
		<div class="relative z-10 h-full w-full rounded-lg bg-white">
			{#if status}
				<Badge class="absolute right-4 top-4 capitalize">{status}</Badge>
			{/if}
			<div class="absolute bottom-2 left-4 right-4 top-4 flex flex-col gap-3">
				<div class="flex flex-row items-center">
					<div class="h-4 w-[2px] bg-primary-foreground"></div>
					<p class="ml-2 font-semibold text-primary-foreground">{interview.company}</p>
				</div>
				<p class="text-2xl font-semibold text-primary-foreground">{interview.position}</p>
				{#if status === 'completed'}
					<Progress value={100} class="mt-6" />
					<p class="text-sm text-primary-foreground">100% completed</p>
				{:else}
					<Progress value={2} class="mt-6" />
					<p class="text-sm text-primary-foreground">Not Yet Started</p>
				{/if}
			</div>
		</div>
	</div>
	<div>
		<div class="mb-2 flex items-center space-x-2 text-sm font-medium md:text-base">
			<span class="flex items-center">
				<Inbox class="mr-2 size-4 text-primary group-hover:text-secondary-foreground" />
				{questions.length} questions
			</span>
			<span class="flex items-center">
				<Timer class="mr-2 size-4 text-primary group-hover:text-secondary-foreground" />
				about {questions.length * 2} minutes
			</span>
		</div>
		<div class="mt-4 items-center">
			<p class="w-full font-medium">Description</p>
			<p
				class="mt-1 line-clamp-4 text-sm font-normal text-foreground/80 group-hover:text-secondary-foreground/80"
			>
				{interview.description}
			</p>
		</div>
	</div>
</a>
