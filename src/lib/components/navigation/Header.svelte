<script lang="ts">
	import { Button, DropdownMenu, Logo } from '$lib/components';
	import { Menu, X } from 'lucide-svelte';
	import { resetMode, setMode } from 'mode-watcher';
	import { Moon, Sun } from 'radix-icons-svelte';

	let { session } = $props();
	let isOpen = $state(false);
</script>

<header class="py-10">
	<div class="container">
		<nav class="relative z-50 flex justify-between">
			<div class="mr-3 flex items-center md:gap-x-12">
				<Logo />
				<div class="hidden md:flex md:gap-x-6">
					<Button href="#features" variant="ghost">Features</Button>
					<Button href="#testimonials" variant="ghost">Testimonials</Button>
				</div>
			</div>
			<div class="flex items-center gap-x-3 md:gap-x-6">
				{#if session}
					<Button href="/app">Go to Dashboard</Button>

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
							<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => resetMode()}>Default</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<div class="hidden md:block">
						<Button href="/sign-in" variant="ghost">Sign in</Button>
					</div>

					<Button href="/sign-up"
						><span>Get started <span class="hidden lg:inline">today</span></span></Button
					>

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
							<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => resetMode()}>Default</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<div class="-mr-1 md:hidden">
						{#if isOpen}
							<div>
								<Button
									variant="ghost"
									class="relative z-20"
									size="icon"
									on:click={() => (isOpen = false)}
								>
									<span class="sr-only">Close menu</span>
									<X class="size-6" />
								</Button>
								<div>
									<div
										class="fixed inset-0 -z-10 bg-muted/50"
										aria-hidden={isOpen}
										on:click={() => (isOpen = false)}
									></div>
									<div
										class="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-background p-4 text-lg tracking-tight text-foreground shadow-xl ring-1 ring-ring/5"
										tabindex="-1"
									>
										<a class="block w-full p-2" href="#features">Features</a>
										<a class="block w-full p-2" href="#testimonials">Testimonials</a>
										<hr class="m-2 border-muted" />
										<a class="block w-full p-2" href="/sign-in">Sign in</a>
									</div>
								</div>
							</div>
						{:else}
							<div>
								<Button
									variant="ghost"
									size="icon"
									aria-expanded={isOpen}
									on:click={() => (isOpen = true)}
									type="button"
								>
									<span class="sr-only">Open main menu</span>
									<Menu class="size-6" />
								</Button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</nav>
	</div>
</header>
