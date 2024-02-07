<script lang="ts">
	import { enhance } from '$app/forms';
	import { DesktopSideBar, MobileSideBar, Button, Logo, DropdownMenu } from '$lib/components';
	import { Menu } from 'lucide-svelte';

	let { children, data } = $props();
	let isOpen = $state(false);
</script>

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<MobileSideBar bind:isOpen user={data.user} />

<!-- Static sidebar for desktop -->
<DesktopSideBar user={data.user} />

<div class="flex flex-1 flex-col md:pl-72">
	<div class="sticky top-0 z-10 bg-transparent p-6 backdrop-blur md:hidden">
		<div class="flex items-center justify-between gap-3">
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
			<Logo />
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="group block">
					<div class="flex items-center justify-start">
						<div>
							{#if data.user.image}
								<img
									class="inline-block size-9 rounded-full"
									src={data.user.image}
									alt="Photo of {data.user.first_name} {data.user.last_name}"
								/>
							{:else}
								<img
									class="inline-block size-9 rounded-full"
									src="/poddle.webp"
									alt="Poddle by Freepik"
								/>
							{/if}
						</div>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item href="/app/settings">Profile</DropdownMenu.Item>
						<form action="/logout?/logout" class="w-full" method="post" use:enhance>
							<DropdownMenu.Item>
								<button tabindex={-1} class="flex w-full cursor-default justify-start" type="submit"
									>Logout</button
								>
							</DropdownMenu.Item>
						</form>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<!-- Main -->
	<main class="relative isolate flex min-h-dvh flex-1 flex-col bg-transparent">
		<div class="flex h-3 flex-shrink-0 bg-transparent"></div>

		<div class="relative block w-full flex-1 flex-col rounded-tl-xl bg-transparent">
			{@render children()}
		</div>
	</main>
</div>
