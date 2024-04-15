<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Input, Label, Logo } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader2, XCircle, Github } from 'lucide-svelte';
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
		<div class="absolute left-4 top-4 z-10 md:left-8">
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
								<!--
								<div class="text-sm">
									<a
										href="/forgot-password"
										class="font-medium text-muted-foreground hover:text-muted-foreground/80"
									>
										Forgot your password?
									</a>
								</div>
                                -->
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
					<Button href="/sign-in/github" variant="outline">
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
								/></svg
							>
						{/if}
						Github
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
