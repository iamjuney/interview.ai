<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Label, AlertDialog } from '$lib/components';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import type { User } from 'lucia';

	let { data } = $props();
	let user: User = $derived(data.user);
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
		<h1 class="truncate text-3xl font-medium tracking-tight">User Settings</h1>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Personal information</h2>
			<p class="text-foreground/60">Update your information and profile details.</p>

			<form class="max-w-xl text-foreground/60" action="#" method="POST">
				<div class="mt-4">
					<p class="text-sm font-medium" aria-hidden="true">Photo</p>
					<div class="mt-1 lg:hidden">
						<div class="flex items-center">
							<div
								class="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
								aria-hidden="true"
							>
								{#if user.image}
									<img class="h-full w-full rounded-full" src={user.image} alt="" />
								{:else}
									<img
										class="h-full w-full rounded-full"
										src="/poddle.webp"
										alt="Poddle by Freepik"
									/>
								{/if}
							</div>
							<div class="ml-5 rounded-md shadow-sm">
								<div
									class="group relative flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50"
								>
									<label
										for="mobile-user-photo"
										class="pointer-events-none relative text-sm font-medium leading-4"
									>
										<span>Change</span>
										<span class="sr-only"> user photo</span>
									</label>
									<input
										id="mobile-user-photo"
										name="user-photo"
										type="file"
										class="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="relative hidden overflow-hidden rounded-full lg:inline-block">
						{#if user.image}
							<img class="relative size-40 rounded-full" src={user.image} alt="" />
						{:else}
							<img class="relative size-40 rounded-full" src="/poddle.webp" alt="" />
						{/if}
						<label
							for="desktop-user-photo"
							class="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
						>
							<span>Change</span>
							<span class="sr-only"> user photo</span>
							<input
								type="file"
								id="desktop-user-photo"
								name="user-photo"
								class="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
							/>
						</label>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 sm:col-span-6">
						<Label for="first_name">First name</Label>
						<Input id="first_name" name="first_name" placeholder={user.first_name} />
					</div>

					<div class="col-span-12 sm:col-span-6">
						<Label for="last_name">Last name</Label>
						<Input id="last_name" name="last_name" placeholder={user.last_name} />
					</div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg">Save Changes</Button>
				</div>
			</form>
		</div>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Danger Zone</h2>
			<p class="text-foreground/60">Manage your account and delete your account.</p>

			<form class="mt-4" action="#" use:enhance method="POST">
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button size="lg" variant="destructive">Delete your account</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently <strong>delete</strong> your account
								and remove your data from our servers.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								type="submit"
								class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
								>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</form>
		</div>
	</div>
{/if}
