<script lang="ts">
	import { navigating } from '$app/stores';
	import { LayoutBackground } from '$lib/components';
	import { ModeWatcher } from 'mode-watcher';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import '../../app.pcss';

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16,
		showSpinner: false
	});

	$effect(() => {
		if ($navigating) {
			NProgress.start();
		} else NProgress.done();
	});

	let { children } = $props();
</script>

<ModeWatcher />
<LayoutBackground />

<div class="relative accent-primary">
	{@render children()}
</div>

<style>
	:global(#nprogress .bar) {
		height: 4px !important;
		background: linear-gradient(
			90deg,
			hsl(var(--primary)) 0%,
			hsl(var(--primary)) 50%,
			hsl(var(--primary)) 100%
		) !important;
	}
</style>
