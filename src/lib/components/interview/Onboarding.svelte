<script lang="ts">
	import { AlertDialog } from '$lib/components';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';

	let startOnboarding = $state(false);
	let loaded = $state(false);

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
				element: '#Interviews',
				popover: {
					title: 'Interviews',
					description:
						'Here you can see all the interviews you have completed and the feedback you have received.',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#Questions',
				popover: {
					title: 'Questions',
					description: 'You can practice your interview skills by answering questions here.',
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
					title: 'End of tour',
					description:
						'You have completed the tour, you can always start it again from the settings.',
					side: 'left',
					align: 'start'
				}
			}
		]
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
		loaded = true;
	});
</script>

<AlertDialog.Root bind:open={loaded}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<div class="mx-auto">
				<!--  -->
				<LottiePlayer
					src="https://lottie.host/4b836bf7-ae16-41fc-b06f-0860256a437c/niM3eQh9v8.json"
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
			<AlertDialog.Cancel>Skip</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					startOnboarding = true;
				}}>Take a tour</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
