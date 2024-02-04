<script lang="ts">
	import { Badge, Progress, Button } from '$lib/components';
	import type { Interview, Question } from '$lib/types';
	import { Inbox, Timer } from 'lucide-svelte';

	let { interview } = $props<{ interview: Interview }>();

	const questions = interview.questions as Question[];
</script>

<div class="group relative cursor-pointer rounded-xl border p-4 shadow hover:bg-secondary">
	<a
		class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg shadow"
		href="/app/interviews/{interview.slug}"
	>
		<div class="relative h-full w-full rounded-lg bg-white">
			<!-- {#if interview.status}
				<Badge class="absolute right-4 top-4 capitalize">{interview.status}</Badge>
			{/if} -->
			<div class="absolute bottom-2 left-4 right-4 top-4 flex flex-col gap-3">
				<div class="flex flex-row items-center">
					<div class="h-4 w-[2px] bg-primary-foreground"></div>
					<p class="ml-2 font-semibold text-primary-foreground">{interview.company}</p>
				</div>
				<p class="text-2xl font-semibold text-primary-foreground">{interview.position}</p>
				<Progress value={2} class="mt-6" />
				<p class="text-sm text-primary-foreground">Not Yet Started</p>
				<!-- <p class="text-sm text-primary-foreground">0% completed</p> -->
			</div>
		</div>
	</a>
	<a href="/app/interviews/{interview.slug}">
		<div class="mb-2 flex items-center space-x-2 font-medium">
			<span class="flex items-center">
				<Inbox class="mr-2 size-4 text-primary" />
				{questions.length} questions
			</span>
			<span class="flex items-center">
				<Timer class="mr-2 size-4 text-primary" />
				about {questions.length * 2} minutes
			</span>
		</div>
		<div class="mt-4 items-center">
			<p class="w-full font-medium">Description</p>
			<p class="mt-1 line-clamp-4 text-sm font-normal text-foreground/80">
				{interview.description}
			</p>
		</div>
	</a>
</div>
