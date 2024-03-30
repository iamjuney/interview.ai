<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Input, Label, Logo } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader2, XCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let animate = $state(false);
	let isLoading = $state(false);
	let failedSignupData = $state<Record<string, any>>();

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				failedSignupData = result.data;
				isLoading = false;
				return;
			}
			await applyAction(result);
		};
	};
</script>

<div class="container relative">
	{#if animate}
		<div class="absolute left-4 top-4 z-10 md:left-8 md:top-8">
			<Logo />
		</div>
		<Button href="/sign-in" variant="ghost" class="absolute right-4 top-4 z-10 md:right-8 md:top-8">
			Sign in
		</Button>

		<div class="grid place-content-center py-40" in:fly={flyOptions}>
			<div class="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
					<p class="text-sm text-muted-foreground">Fill up the form below to signup</p>
					{#if failedSignupData}
						<div class="flex items-center justify-center text-destructive">
							<XCircle class="mr-2 size-4 " />
							<span class="text-sm">{failedSignupData.message}</span>
						</div>
					{/if}
				</div>
				<div class="grid gap-6">
					<form use:enhance={handleSubmit} action="?/register" method="post">
						<div class="grid gap-6">
							<div class="grid gap-1">
								<Label class="block text-sm font-medium" for="first_name">First Name</Label>
								<Input
									id="first_name"
									name="first_name"
									placeholder="Your first name"
									type="text"
									autocapitalize="none"
									autocomplete="first_name"
									autocorrect="off"
									required
									disabled={isLoading}
								/>
							</div>
							<div class="grid gap-1">
								<Label class="block text-sm font-medium" for="last_name">Last Name</Label>
								<Input
									id="last_name"
									name="last_name"
									placeholder="Your last name"
									type="text"
									autocapitalize="none"
									autocomplete="last_name"
									autocorrect="off"
									required
									disabled={isLoading}
								/>
							</div>
							<div class="grid gap-1">
								<Label class="block text-sm font-medium" for="email">Email</Label>
								<Input
									id="email"
									name="email"
									placeholder="name@example.com"
									type="email"
									autocapitalize="none"
									autocomplete="email"
									autocorrect="off"
									required
									disabled={isLoading}
								/>
							</div>
							<div class="grid gap-1">
								<Label class="block text-sm font-medium" for="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									required
									disabled={isLoading}
								/>
							</div>
							<div class="grid gap-1">
								<Label class="block text-sm font-medium" for="confirm_password"
									>Confirm Password</Label
								>
								<Input
									id="confirm_password"
									name="confirm_password"
									type="password"
									required
									disabled={isLoading}
								/>
							</div>
							<Button disabled={isLoading} type="submit">
								{#if isLoading}
									<Loader2 class="mr-2 size-4 animate-spin" />
								{/if}
								Sign Up
							</Button>
						</div>
					</form>
				</div>
				<p class="px-8 text-center text-sm text-muted-foreground">
					By clicking continue, you agree to our{' '}
					<a href="/terms" class="underline underline-offset-4 hover:text-primary">
						Terms of Service
					</a>{' '}
					and{' '}
					<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
						Privacy Policy
					</a>
					.
				</p>
			</div>
		</div>
	{/if}
</div>
