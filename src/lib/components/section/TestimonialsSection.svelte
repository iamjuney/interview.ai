<script lang="ts">
	const testimonials = [
		{
			name: 'Xyber Pastoril (@xybr.dev)',
			title: 'Alumnus',
			quote:
				'Definitely a big win for those who are wishing to boost their confidence in programming interviews!'
		},
		{
			name: 'Mojo Jojo',
			title: '3rd Year Student',
			quote:
				'For a web development noob like me, I found the web application very fascinating as there are a lot of things going on in the backend. From video transcription to the response, it is just seamless. However, I could suggest the KKK - Kiss Kick Kiss method for the response part. Thats all, its been a nice experience having to beta-test this website'
		},
		{
			name: 'Max R. Tumaob Jr.',
			title: '4th Year Student',
			quote: 'This is good practice for an internship interview.'
		},
		{
			name: 'Omar Khan',
			title: 'Freshmen',
			quote:
				'This platform is a fantastic resource for early career seekers like me. The variety of mock interview scenarios helped me gain experience and build a strong foundation for my future job search.'
		},
		{
			name: 'Sarah Patel',
			title: "Master's Program",
			quote:
				"As someone transitioning careers, I found the platform's personalized feedback from coaches incredibly valuable. Their guidance helped me refine my interview approach and tailor my responses to highlight my transferable skills and experience."
		},
		{
			name: 'Chen Wang',
			title: 'International Student',
			quote:
				'This platform has been instrumental in helping me overcome my language barrier. Practicing speaking in English through mock interviews and receiving feedback on my clarity and pronunciation boosted my confidence significantly.'
		}
	];
</script>

{#snippet testimonialCard(testimonial)}
	<li>
		<figure class="relative rounded-2xl bg-primary/10 p-6 shadow-xl">
			<svg aria-hidden="true" width="105" height="78" class="absolute left-6 top-6 fill-primary/20"
				><path
					d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"
				></path></svg
			>
			<blockquote class="relative">
				<p class="text-lg tracking-tight text-muted-foreground">
					{testimonial.quote}
				</p>
			</blockquote>
			<figcaption
				class="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6"
			>
				<div>
					<div class="font-display text-base">
						{testimonial.name}
					</div>
					<div class="mt-1 text-sm text-muted-foreground">
						{testimonial.title}
					</div>
				</div>
			</figcaption>
		</figure>
	</li>
{/snippet}

<section id="testimonials" aria-label="What our customers are saying" class="py-20 sm:py-32">
	<div class="container">
		<div class="mx-auto max-w-2xl md:text-center">
			<h2 class="font-display text-3xl tracking-tight sm:text-4xl">
				Loved by computer science students from Visayas State University.
			</h2>
			<p class="mt-4 text-lg tracking-tight text-muted-foreground">
				Our platform provides a comprehensive suite of tools and resources to help you excel in your
				interview process and land your dream job.
			</p>
		</div>
		<ul
			role="list"
			class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
		>
			<li>
				<ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
					{#each testimonials.slice(0, 2) as testimonial}
						{@render testimonialCard(testimonial)}
					{/each}
				</ul>
			</li>

			<li>
				<ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
					{#each testimonials.slice(2, 4) as testimonial}
						{@render testimonialCard(testimonial)}
					{/each}
				</ul>
			</li>

			<li>
				<ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
					{#each testimonials.slice(4, 6) as testimonial}
						{@render testimonialCard(testimonial)}
					{/each}
				</ul>
			</li>
		</ul>
	</div>
</section>
