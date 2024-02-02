<script lang="ts">
	import { Badge, Progress } from '$lib/components';
	import type { Interview } from '$lib/types';
	import { Inbox, Timer } from 'lucide-svelte';

	let { interview } = $props<{ interview: Interview }>();
</script>

<div class="group relative cursor-pointer rounded-xl border p-4 shadow hover:bg-secondary">
	<a
		class="relative mb-4 grid aspect-[16/9] w-full flex-shrink-0 place-items-center rounded-lg shadow"
		href="/app/interviews/sample"
	>
		<div class="relative h-full w-full rounded-lg bg-white">
			<div class="absolute left-4 top-4 flex flex-row items-center">
				<div class="h-4 w-[2px] bg-primary-foreground"></div>
				<p class="ml-2 font-semibold text-primary-foreground">{interview.company}</p>
			</div>
			{#if interview.status}
				<Badge class="absolute right-4 top-4 capitalize">{interview.status}</Badge>
			{/if}
			<div class="absolute bottom-2 left-4 right-4 top-14 flex flex-col">
				<p class="text-2xl font-semibold text-primary-foreground">{interview.title}</p>
			</div>
			<div class="absolute bottom-6 left-4 right-4">
				{#if interview.progress}
					<Progress value={interview.progress} />
				{/if}
			</div>
		</div>
	</a>
	<a href="/app/interviews/sample">
		<div class="mb-2 flex items-center space-x-2 font-medium">
			<span class="flex items-center">
				<Inbox class="mr-2 size-4 text-primary" />
				{interview.questions} questions
			</span>
			<span class="flex items-center">
				<Timer class="mr-2 size-4 text-primary" />
				about {interview.duration}
			</span>
		</div>
		<div class="mt-4 items-center">
			<p class="w-full font-medium">Description</p>
			<p class="line-cInbox-4 mt-1 text-sm font-normal text-foreground/80">
				{interview.description}
			</p>
		</div>
	</a>
</div>
