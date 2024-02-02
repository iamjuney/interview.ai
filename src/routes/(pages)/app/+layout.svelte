<script lang="ts">
	import { DesktopSideBar, MobileSideBar, Button } from '$lib/components';
	import { Menu } from 'lucide-svelte';

	let { children, data } = $props();
	let isOpen = $state(false);
</script>

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<MobileSideBar bind:isOpen user={data.user} />

<!-- Static sidebar for desktop -->
<DesktopSideBar user={data.user} />

<div class="flex flex-1 flex-col md:pl-72">
	<div class="sticky top-0 z-10 bg-transparent p-6 md:hidden">
		<Button
			variant="ghost"
			size="icon"
			aria-expanded={isOpen}
			on:click={() => {
				isOpen = !isOpen;
			}}
		>
			<span class="sr-only">Open main menu</span>
			<Menu class="size-6" />
		</Button>
	</div>

	<!-- Main -->
	<main class="relative isolate flex min-h-dvh flex-1 flex-col bg-transparent">
		<div class="flex h-3 flex-shrink-0 bg-transparent"></div>

		<div
			class="relative isolate block w-full flex-1 flex-col overflow-y-auto rounded-tl-xl bg-transparent"
		>
			{@render children()}
		</div>
	</main>
</div>
