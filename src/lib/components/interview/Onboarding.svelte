<script lang="ts">
	import { enhance } from '$app/forms';
	import { AlertDialog } from '$lib/components';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';

	let startOnboarding = $state(false);
	let showOnboarding = $state(false);

	const driverObj = driver({
		showProgress: true,
		steps: [
			{
				element: '#Dashboard',
				popover: {
					title: 'Dashboard',
					description:
						'This is your dashboard, you can see your progress and suggested interviews here.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#Analytics',
				popover: {
					title: 'Dashboard Analytics',
					description: 'Here you can see your progress and stats.',
					side: 'bottom',
					align: 'start'
				}
			},
			{
				element: '#SuggestedInterviews',
				popover: {
					title: 'Suggested Interviews',
					description: 'You can see the suggested interviews here.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#Interviews',
				popover: {
					title: 'Interviews',
					description:
						'Here you can see all the interviews you have completed and the feedback you have received. Click it to see more details.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#StartNewInterview',
				popover: {
					title: 'Lets Start New Interview',
					description: 'Click the button to start a new interview.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#BrowseInterviews',
				popover: {
					title: 'Browse Interviews',
					description: 'You can browse all the interviews available here.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#Questions',
				popover: {
					title: 'Questions',
					description:
						'You can practice your interview skills by answering questions here. Click it to see more details.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#BrowseQuestions',
				popover: {
					title: 'Browse Questions',
					description: 'You can browse all the questions available here.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#Settings',
				popover: {
					title: 'Settings',
					description: 'You can update your profile and account settings here.',
					side: 'left',
					align: 'start'
				}
			},
			{
				popover: {
					title: 'Congratulations!',
					description:
						'You have completed the tour, you can always start it again from the settings.',
					side: 'left',
					align: 'start'
				}
			}
		],
		onDestroyStarted: () => {
			if (!driverObj.hasNextStep() || confirm('Are you to exit tour?')) {
				driverObj.destroy();
			}
		}
	});

	const controlsLayout = [
		'previousFrame',
		'playpause',
		'stop',
		'nextFrame',
		'progress',
		'frame',
		'loop',
		'spacer',
		'background',
		'snapshot',
		'zoom',
		'info'
	];

	$effect(() => {
		if (startOnboarding) driverObj.drive();
	});

	$effect(() => {
		showOnboarding = true;
	});
</script>

<AlertDialog.Root bind:open={showOnboarding}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<div class="mx-auto">
				<LottiePlayer
					src="/assets/biking.json"
					autoplay={true}
					loop={true}
					controls={false}
					renderer="svg"
					background="transparent"
					height={280}
					width={280}
					{controlsLayout}
				/>
			</div>
			<AlertDialog.Title class="text-center">Welcome to Interview Hero</AlertDialog.Title>
			<AlertDialog.Description class="text-center">
				Now you can start practicing your interview skills and get feedback
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<div class="flex w-full items-center justify-between gap-1">
				<form
					action="/app/settings?/updateShowOnboarding"
					method="post"
					use:enhance
					class="flex w-full items-center justify-between"
				>
					<div class="flex items-center">
						<input
							type="checkbox"
							id="show_onboarding"
							name="show_onboarding"
							class="size-4 rounded border-gray-300"
						/>
						<label for="show_onboarding" class="ml-2 block text-sm">Don't show this again</label>
					</div>

					<div class="flex gap-3">
						<AlertDialog.Cancel type="submit">Skip</AlertDialog.Cancel>
						<AlertDialog.Action
							type="submit"
							on:click={() => {
								startOnboarding = true;
							}}>Take a tour</AlertDialog.Action
						>
					</div>
				</form>
			</div>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
