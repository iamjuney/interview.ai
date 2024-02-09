<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertDialog, Button, Input, Label } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { User } from 'lucia';
	import { XCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let user: User = $derived(data.user);
	let animate = $state(false);
	let isSubmitting = $state(false);
	let failedUpdateData = $state<Record<string, any>>();

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				failedUpdateData = result.data;
				isSubmitting = false;
				return;
			}
			await applyAction(result);
		};
	};
</script>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<h1 class="truncate text-3xl font-medium tracking-tight">User Settings</h1>

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Personal information</h2>
			<p class="text-foreground/60">Update your information and profile details.</p>

			{#if failedUpdateData}
				<div class="flex items-center justify-center text-destructive">
					<XCircle class="mr-2 size-4 " />
					<span class="text-sm">{failedUpdateData.message}</span>
				</div>
			{/if}

			<form
				class="max-w-xl"
				action="?/updateName"
				method="post"
				use:enhance={handleSubmit}
				enctype="multipart/form-data"
			>
				<input type="hidden" id="user_id" name="user_id" value={user.userId} />
				<div class="mt-4">
					<p class="text-sm font-medium text-foreground/60" aria-hidden="true">Photo</p>
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
										for="mobile_user_photo"
										class="pointer-events-none relative text-sm font-medium leading-4 text-foreground/60"
									>
										<span>Change</span>
										<span class="sr-only"> user photo</span>
									</label>
									<input
										id="mobile_user_photo"
										name="user_photo"
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
							for="desktop_user_photo"
							class="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
						>
							<span>Change</span>
							<span class="sr-only"> user photo</span>
							<input
								type="file"
								id="desktop_user_photo"
								name="user_photo"
								class="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
							/>
						</label>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 sm:col-span-6">
						<Label for="first_name" class="text-foreground/60">First name</Label>
						<Input id="first_name" name="first_name" placeholder={user.first_name} required />
					</div>

					<div class="col-span-12 sm:col-span-6">
						<Label for="last_name" class="text-foreground/60">Last name</Label>
						<Input id="last_name" name="last_name" placeholder={user.last_name} required />
					</div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg" bind:disabled={isSubmitting}>Save Changes</Button>
				</div>
			</form>
		</div>
		<!-- <div class="mt-6 italic">Do you want to change your password?</div> -->

		<div class="max-w-xl space-y-2">
			<h2 class="truncate text-xl font-medium tracking-tight">Change Password</h2>
			<p class="text-foreground/60">
				Ensure your account is using a long, random password to stay secure.
			</p>

			<form class="max-w-xl text-foreground/60" action="#" method="POST">
				<div class="mt-6">
					<Label for="current_password">Current Password</Label>
					<Input
						id="current_password"
						name="current_password"
						type="password"
						placeholder="Enter your current password"
					/>
				</div>
				<div class="mt-6 grid grid-cols-12 gap-6">
					<div class="col-span-12 sm:col-span-6">
						<Label for="new_password">New Password</Label>
						<Input
							id="new_password"
							name="new_password"
							type="password"
							placeholder="New password"
						/>
					</div>

					<div class="col-span-12 sm:col-span-6">
						<Label for="confirm_password">Confirm New Password</Label>
						<Input
							id="confirm_password"
							name="confirm_password"
							type="password"
							placeholder="Confirm new password"
						/>
					</div>
				</div>

				<div class="mt-6">
					<Button type="submit" size="lg">Update Password</Button>
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
