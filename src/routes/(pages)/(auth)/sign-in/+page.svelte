<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Input, Label, Logo } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader2, XCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let isLoading = $state(false);
	let animate = $state(false);
	let failedSigninData = $state<Record<string, any>>();

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
				failedSigninData = result.data;
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
		<Button href="/sign-up" variant="ghost" class="absolute right-4 top-4 z-10 md:right-8 md:top-8">
			Sign up
		</Button>

		<div class="grid place-content-center py-40" in:fly={flyOptions}>
			<div class="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
					<p class="text-sm text-muted-foreground">
						Enter your credentials below to sign in your account
					</p>
					{#if failedSigninData}
						<div class="flex items-center justify-center text-destructive">
							<XCircle class="mr-2 size-4 " />
							<span class="text-sm">{failedSigninData.message}</span>
						</div>
					{/if}
				</div>
				<div class="grid gap-6">
					<form use:enhance={handleSubmit} action="?/signin" method="post">
						<div class="grid gap-6">
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
									disabled={isLoading}
									required
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
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<Input
										id="remember_me"
										name="remember_me"
										type="checkbox"
										class="size-4 rounded border-gray-300"
										disabled={isLoading}
									/>
									<Label for="remember_me" class="ml-2 block text-sm">Remember me</Label>
								</div>

								<div class="text-sm">
									<a
										href="/forgot-password"
										class="font-medium text-muted-foreground hover:text-muted-foreground/80"
									>
										Forgot your password?
									</a>
								</div>
							</div>
							<Button disabled={isLoading} type="submit">
								{#if isLoading}
									<Loader2 class="mr-2 size-4 animate-spin" />
								{/if}
								Sign In
							</Button>
						</div>
					</form>
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t" />
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
						</div>
					</div>
					<Button variant="outline" type="button" disabled={isLoading}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 48 48"
								><path
									fill="#FFC107"
									d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
								/><path
									fill="#FF3D00"
									d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
								/><path
									fill="#4CAF50"
									d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
								/><path
									fill="#1976D2"
									d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
								/></svg
							>
						{/if}
						Google
					</Button>
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
