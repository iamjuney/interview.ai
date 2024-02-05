<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button, Input, Label, Logo } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader2, XCircle } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let isLoading = $state(false);
	let animate = $state(false);
	// let failedSigninData = $state<Record<string, any>>();

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	// const handleSubmit: SubmitFunction = () => {
	// 	isLoading = true;

	// 	return async ({ result }) => {
	// 		if (result.type === 'failure') {
	// 			failedSigninData = result.data;
	// 			isLoading = false;
	// 			return;
	// 		}
	// 		await applyAction(result);
	// 	};
	// };
</script>

<div class="container relative">
	<div class="absolute left-4 top-4 z-10 md:left-8 md:top-8">
		<Logo />
	</div>
	<Button href="/sign-in" variant="ghost" class="absolute right-4 top-4 z-10 md:right-8 md:top-8">
		Sign in
	</Button>
	{#if animate}
		<div class="grid place-content-center py-40" in:fly={flyOptions}>
			<div class="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Forgot Password</h1>
					<p class="text-sm text-muted-foreground">Enter your email below to reset your password</p>
					<!-- {#if failedSigninData}
						<div class="flex items-center justify-center text-destructive">
							<XCircle class="mr-2 size-4 " />
							<span class="text-sm">{failedSigninData.message}</span>
						</div>
					{/if} -->
				</div>
				<div class="grid gap-6">
					<!-- <form use:enhance={handleSubmit} action="?/signin" method="post"> -->
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

						<Button disabled={isLoading} type="submit">
							{#if isLoading}
								<Loader2 class="mr-2 size-4 animate-spin" />
							{/if}
							Send reset link
						</Button>
					</div>
					<!-- </form> -->
				</div>
			</div>
		</div>
	{/if}
</div>
