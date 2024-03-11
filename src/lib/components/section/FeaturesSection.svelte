<script lang="ts">
	let activeFeature = $state(0);

	// Features data
	const features = [
		{
			id: 0,
			title: 'Mock Interviews',
			description:
				'Practice answering common interview questions. Get access to a library of interview questions tailored to various industries and positions.',
			image: ''
		},
		{
			id: 1,
			title: 'Speech Analysis',
			description:
				'Analyze your speech for clarity and confidence. Use our AI-powered speech analysis tool to identify areas for improvement, such as filler words, pacing, and vocal variety.',
			image: ''
		},
		{
			id: 2,
			title: 'Interview Question Library',
			description:
				'Search for specific interview questions. Find relevant questions based on your target industry, position, and experience level.',
			image: ''
		},
		{
			id: 3,
			title: 'User Settings',
			description:
				'Manage your account settings. Customize your profile, update password, and delete account.',
			image: ''
		}
	];
</script>

<section
	id="features"
	aria-label="Features for job interview preparation"
	class="relative overflow-hidden bg-primary pb-28 pt-20 sm:py-32"
>
	<img
		alt=""
		loading="lazy"
		width="2245"
		height="1636"
		decoding="async"
		data-nimg="1"
		class="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
		style="color:transparent"
		src={features[activeFeature].image}
	/>
	<div class="container relative">
		<div class="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
			<h2
				class="font-display text-3xl tracking-tight text-primary-foreground sm:text-4xl md:text-5xl"
			>
				Everything you need to ace your job interview.
			</h2>
			<p class="mt-6 text-lg tracking-tight text-primary-foreground/90">
				We provide comprehensive resources and tools to help you feel confident and prepared for
				your interview.
			</p>
		</div>
		<div
			class="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
		>
			<div
				class="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5"
			>
				<div
					class="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal"
					role="tablist"
					aria-orientation="vertical"
				>
					{#each features as feature, idx}
						<div
							class="group relative rounded-full px-4 py-1 text-blue-100 hover:bg-white/10 lg:rounded-l-xl lg:rounded-r-none lg:p-6 lg:text-white lg:hover:bg-white/5 {activeFeature ===
								idx &&
								'bg-white text-foreground lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'}"
						>
							<h3>
								<button
									class="font-display ui-not-focus-visible:outline-none text-lg"
									id={`headlessui-tabs-tab-${feature.id}`}
									role="tab"
									type="button"
									aria-selected={activeFeature === idx}
									tabindex={activeFeature === idx ? 0 : -1}
									data-headlessui-state={activeFeature === idx ? 'selected' : ''}
									aria-controls={`headlessui-tabs-panel-${feature.id}`}
									on:click={() => (activeFeature = idx)}
								>
									<span class="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"
									></span>
									{feature.title}
								</button>
							</h3>
							<p class="mt-2 hidden text-sm text-white lg:block">{feature.description}</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="lg:col-span-7">
				{#each features as feature, idx}
					<div
						id={`headlessui-tabs-panel-${feature.id}`}
						role="tabpanel"
						tabindex={activeFeature === idx ? 0 : -1}
						data-headlessui-state={activeFeature === idx ? 'selected' : ''}
						aria-labelledby={`headlessui-tabs-tab-${feature.id}`}
						hidden={activeFeature !== idx}
					>
						<div class="relative sm:px-6 lg:hidden">
							<div
								class="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"
							></div>
							<p class="relative mx-auto max-w-2xl text-base text-white sm:text-center">
								{feature.description}
							</p>
						</div>
						<div
							class="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"
						>
							<img
								alt=""
								fetchpriority="high"
								width="2174"
								height="1464"
								decoding="async"
								data-nimg="1"
								class="w-full"
								style="color:transparent"
								sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
								srcset={feature.image}
								src={feature.image}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
