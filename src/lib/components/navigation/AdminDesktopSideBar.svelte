<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button, DropdownMenu, Logo } from '$lib/components';
	import type { User } from 'lucia';
	import { LayoutDashboard, Users, Settings, Video } from 'lucide-svelte';
	import { resetMode, setMode } from 'mode-watcher';
	import { Moon, Sun } from 'radix-icons-svelte';
	import { CldImage } from 'svelte-cloudinary';

	let { user } = $props<{ user: User }>();
	let isLoaded = $state(false);
	let newProfile = $state('');
	let pathName = $derived(() => {
		const path = $page.url.pathname.split('/')[2];
		return '/admin' + (path ? `/${path}` : '');
	});

	$effect(() => {
		isLoaded = true;
	});

	// check if profile image is from github
	$effect(() => {
		if (user.image && user.image.includes('github')) {
			newProfile = user.image;
		}
	});

	const nav_links = [
		{
			name: 'Dashboard',
			icon: LayoutDashboard,
			href: '/admin'
		},
		{
			name: 'Interviews',
			icon: Video,
			href: '/admin/interviews'
		},
		{
			name: 'Users',
			icon: Users,
			href: '/admin/users'
		},
		{
			name: 'Settings',
			icon: Settings,
			href: '/admin/settings'
		}
	];
</script>

<div class="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
	<div class="flex min-h-0 flex-1 flex-col bg-transparent">
		<div class="flex flex-1 flex-col overflow-y-auto pb-4 pt-8">
			<div class="flex flex-shrink-0 items-center px-8">
				{#if isLoaded}
					<Logo />
				{/if}
			</div>
			<nav class="mt-24 flex-1 space-y-1">
				<h4 class="px-8 py-2 text-sm text-muted-foreground">Menu</h4>
				{#each nav_links as link}
					{#if pathName() === link.href}
						<a
							id={link.name}
							href={link.href}
							data-sveltekit-preload-data="hover"
							class="group flex items-center border-l-4 border-primary p-2 font-medium"
						>
							<svelte:component this={link.icon} class="mx-5 size-5 flex-shrink-0" />
							{link.name}
						</a>
					{:else}
						<a
							id={link.name}
							href={link.href}
							data-sveltekit-preload-data="hover"
							class="group flex items-center rounded-md px-3 py-2 font-medium text-muted-foreground hover:text-foreground"
						>
							<svelte:component this={link.icon} class="mx-5 size-5 flex-shrink-0" />
							{link.name}
						</a>
					{/if}
				{/each}
			</nav>
		</div>
		<div class="flex flex-shrink-0 p-8">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="group block">
					<div class="flex items-center justify-start">
						<div class="inline-block size-9 overflow-hidden rounded-full">
							{#if newProfile}
								<img
									src={newProfile}
									alt="Photo of {user.first_name} {user.last_name}"
									class="h-9 w-9 rounded-full"
								/>
							{:else if user.image}
								<CldImage
									src={user.image}
									crop="fill"
									width={36 * 4}
									height={36 * 4}
									sizes="100vw"
									alt="Photo of {user.first_name} {user.last_name}"
								/>
							{:else}
								<img class="bg-cover bg-center" src="/assets/poddle.webp" alt="Poddle by Freepik" />
							{/if}
						</div>
						<div class="ml-3 flex flex-col items-start">
							<p class="text-start text-sm font-medium group-hover:text-muted-foreground">
								Welcome admin!
							</p>
							<p class="text-xs font-medium group-hover:text-muted-foreground">View profile</p>
						</div>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item href="/admin/settings">Profile</DropdownMenu.Item>
						<DropdownMenu.Item role="button">
							<form id="myForm" action="/logout?/logout" class="w-full" method="post" use:enhance>
								<button tabindex={-1} class="flex w-full cursor-default justify-start" type="submit"
									>Logout</button
								>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<div class="ml-auto">
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
						<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => resetMode()}>Default</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>
