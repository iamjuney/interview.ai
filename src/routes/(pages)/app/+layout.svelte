<script lang="ts">
	import { Button, DesktopSideBar, MobileSideBar, Onboarding } from '$lib/components';
	import { Menu } from 'lucide-svelte';

	let { children, data } = $props();
	let isOpen = $state(false);
</script>

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<MobileSideBar bind:isOpen user={data.user} />

<!-- Static sidebar for desktop -->
<DesktopSideBar user={data.user} />

<!-- Onboarding -->
{#if data.showOnboarding}
	<Onboarding />
{/if}

<!-- Main content -->
<div class="flex flex-1 flex-col md:pl-72">
	<div class="sticky top-0 bg-transparent p-6 backdrop-blur md:hidden">
		<Button
			class="justify-start"
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
	<main class="relative flex min-h-[calc(100dvh-30px)] w-full flex-1 rounded-tl-xl">
		{@render children()}
	</main>
</div>
