<script lang="ts">
	import { Badge, Button, InterviewStage } from '$lib/components';
	import { ArrowLeft, Loader2 } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let question = $state(data.questionDetails);
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
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href="/app/questions/" class="group flex items-center gap-2">
					<ArrowLeft size="20" class="text-foreground/60 group-hover:text-foreground" />
					<p class="text-foreground/60 group-hover:text-foreground">Back to all recordings</p>
				</a>
			</div>

			<div class="flex w-full items-center justify-between">
				<h2 class="max-w-3xl text-3xl font-medium tracking-tight">{question?.question}</h2>
			</div>
		</div>

		<div class="w-full">
			<InterviewStage {question} />
		</div>
	</div>
{/if}
