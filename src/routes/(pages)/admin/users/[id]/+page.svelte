<script lang="ts">
	import { Badge, UserInterviewSummary } from '$lib/components';
	import type { UserInterview } from '$lib/types';
	import { ArrowLeft, FileQuestion, Gauge, MoveRight } from 'lucide-svelte';
	import { CldImage } from 'svelte-cloudinary';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let user = $state(data.userDetails);
	let userInterviews = $state(data.userInterviews);
	let animate = $state(false);
	let isOpen = $state(false);
	let selectedUserInterview = $state<UserInterview | null>(null);
	let isTotalQuestionsAnsweredZero = $state(false);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};

	function readableDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const getTotalQuestionsAnswered = (i: UserInterview) => {
		let total = 0;

		if (!i.interview) {
			return total;
		}

		for (const question of i.interview.questions) {
			if (!question.answers) {
				continue;
			}

			if (question.answers.length > 0) {
				total++;
			}
		}

		return total;
	};

	const getAveragePronunciationScore = (i: UserInterview) => {
		let total = 0;
		let count = 0;

		if (!i.interview) {
			return total;
		}

		for (const question of i.interview.questions) {
			if (!question.answers) {
				continue;
			}

			for (const answer of question.answers) {
				if (answer.assessment) {
					count++;
					total += answer.assessment.pronunciation_score;
				}
			}
		}

		if (count === 0) {
			return total;
		}

		return total / count;
	};
</script>

{#if selectedUserInterview}
	<UserInterviewSummary
		bind:isOpen
		userInterview={selectedUserInterview}
		noAnswers={isTotalQuestionsAnsweredZero}
	/>
{/if}

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<div class="flex w-full flex-col gap-3">
			<div class="flex items-center">
				<a href="/admin/users" class="group flex items-center gap-2" data-sveltekit-preload-data>
					<ArrowLeft size="20" class="text-muted-foreground group-hover:text-foreground" />
					<p class="text-muted-foreground group-hover:text-foreground">Back to all users</p>
				</a>
			</div>
			<div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<h2 class="text-3xl font-medium tracking-tight">User Data</h2>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
			<div
				class="flex items-center justify-center rounded-lg border bg-gradient-to-br from-primary/30 to-secondary py-4 shadow"
			>
				<div class="flex items-center space-x-4">
					{#if user.image}
						{#if user.image.includes('github')}
							<img
								class="size-16 rounded-full"
								src={user.image}
								alt="Photo of {user.first_name} {user.last_name}"
							/>
						{:else}
							<CldImage
								src={user.image}
								crop="fill"
								width={64 * 4}
								height={64 * 4}
								sizes="100vw"
								alt="Photo of {user.first_name} {user.last_name}"
							/>
						{/if}
					{:else}
						<img src="/assets/poddle.webp" alt="avatar" class="size-12 rounded-full" />
					{/if}
					<div>
						<h2 class="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
						<div class="flex flex-row items-center">
							<div class="h-4 w-[2px] bg-primary"></div>
							<p class="ml-2 text-muted-foreground">{user.email}</p>
						</div>

						{#if user.createdAt}
							<p class="text-muted-foreground">Joined on {readableDate(user.createdAt)}</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="rounded-lg xl:col-span-2">
				<h2 class="mb-4 text-xl font-medium tracking-tight">Statistics</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.stats.in_progress}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Ongoing Interviews</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.stats.completed}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Completed Interviews</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.stats.totalQuestionsAnswered}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Total Questions Answered</p>
					</div>
					<div class="rounded-lg border bg-background p-4 shadow">
						<h3 class="text-xl font-semibold">{data.stats.averageAnswerDuration}</h3>
						<p class="text-sm text-muted-foreground lg:text-base">Average Answer Duration</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 rounded-lg">
			<h2 class="text-xl font-medium tracking-tight">User Interviews</h2>
			<div
				class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#each userInterviews as userInterview}
					<button
						onclick={() => {
							selectedUserInterview = userInterview;
							isTotalQuestionsAnsweredZero = getTotalQuestionsAnswered(userInterview) === 0;
							isOpen = true;
						}}
						class="group relative cursor-pointer rounded-xl border p-4 shadow-sm transition duration-100 hover:bg-accent md:border-0 md:shadow-none"
					>
						<div
							class="relative z-10 mb-4 grid min-h-28 w-full flex-shrink-0 place-items-center rounded-lg shadow-sm"
						>
							<div class="relative h-full w-full rounded-lg border bg-primary/10">
								<Badge class="absolute right-4 top-4 capitalize">{userInterview.status}</Badge>

								<div class="absolute bottom-2 left-4 right-4 top-4 flex flex-col gap-3">
									<div class="flex flex-row items-center">
										<div class="h-4 w-[2px] bg-primary"></div>
										<p class="ml-2 text-muted-foreground">{userInterview.interview.difficulty}</p>
									</div>
									<div>
										<p class="text-left text-xl font-semibold">
											{userInterview.interview.position}
										</p>
										<p class="text-left text-sm text-muted-foreground">
											Date Started: {readableDate(userInterview.createdAt)}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div class="mb-2 flex flex-col items-start space-y-2 text-sm lg:text-base">
								<span class="flex items-center">
									<FileQuestion class="mr-2 size-4 text-primary" />
									{getTotalQuestionsAnswered(userInterview)} answered questions
								</span>
								<span class="flex items-center">
									<Gauge class="mr-2 size-4 text-primary" />
									{getAveragePronunciationScore(userInterview)} average pronunciation score
								</span>
							</div>
						</div>
						<div class="mt-4 flex items-center space-x-2 text-sm font-medium lg:text-base">
							<span class="flex items-center">
								<span class="text-primary group-hover:text-secondary-foreground"> View more </span>
								<MoveRight class="ml-2 size-4 text-primary transition-all group-hover:ml-4" />
							</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
