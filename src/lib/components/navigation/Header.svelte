<script lang="ts">
	import { Button, DropdownMenu, Logo } from '$lib/components';
	import { resetMode, setMode } from 'mode-watcher';
	import { Moon, Sun } from 'radix-icons-svelte';
	import { Menu, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	const flyOptions = {
		y: 30,
		easing: backOut
	};

	let { session } = $props();
	let isOpen = $state(false);
</script>

<header>
	<nav class="container flex items-center justify-between p-6" aria-label="Global">
		<div class="flex lg:flex-1">
			<Logo />
		</div>
		<div class="flex lg:hidden">
			<Button
				variant="ghost"
				size="icon"
				aria-expanded={isOpen}
				on:click={() => (isOpen = !isOpen)}
				type="button"
			>
				<span class="sr-only">Open main menu</span>
				<Menu class="size-6" />
			</Button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			<a href="/" class="text-sm font-semibold leading-6">Features</a>
			<a href="/" class="text-sm font-semibold leading-6">Use Cases</a>
			<a href="/" class="text-sm font-semibold leading-6">About</a>
		</div>
		<div class="hidden space-x-2 lg:flex lg:flex-1 lg:items-center lg:justify-end">
			{#if session}
				<Button href="/app">Go to Dashboard</Button>
			{:else}
				<Button variant="ghost" href="/sign-in">Sign in</Button>
				<Button href="/sign-up">Get Started</Button>
			{/if}

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>Theme</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={() => setMode('light')}>Blue</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => setMode('dark')}>Gold</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => resetMode()}>Default</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</nav>

	<!-- Mobile menu, show/hide based on menu open state. -->
	{#if isOpen}
		<div class="lg:hidden" role="dialog" aria-modal={isOpen}>
			<div
				class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
				transition:fly={flyOptions}
			>
				<div class="flex items-center justify-between">
					<Logo />
					<Button variant="ghost" size="icon" on:click={() => (isOpen = !isOpen)}>
						<span class="sr-only">Close menu</span>
						<X class="size-6" />
					</Button>
				</div>
				<div class="mt-6 flow-root">
					<div class="-my-6 divide-y divide-gray-500/10">
						<div class="space-y-2 py-6">
							<a
								href="/"
								class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50"
								>Features</a
							>
							<a
								href="/"
								class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50"
								>Use Cases</a
							>
							<a
								href="/"
								class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50"
								>About</a
							>
						</div>
						<div class="py-6">
							<a
								href="/sign-in"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50"
								>Sign in</a
							>
						</div>
					</div>

					<Button class="w-full" href="/sign-up">Get Started</Button>
				</div>
			</div>
		</div>
	{/if}
</header>
