<script lang="ts">
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

	let { message } = $props();
	const controlsLayout = [
		'previousFrame',
		'playpause',
		'stop',
		'nextFrame',
		'progress',
		'frame',
		'loop',
		'spacer',
		'background',
		'snapshot',
		'zoom',
		'info'
	];
</script>

<div class="mt-8 grid h-full w-full place-content-center gap-3 text-center">
	<LottiePlayer
		src="/assets/box_empty.json"
		autoplay={true}
		loop={true}
		controls={false}
		renderer="svg"
		background="transparent"
		height={200}
		width={200}
		{controlsLayout}
	/>
	<p class="text-muted-foreground">{message}</p>
</div>
