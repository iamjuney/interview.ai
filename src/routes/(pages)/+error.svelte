<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container">
	<div class=" py-56">
		<div class="text-center">
			<p class="text-sm font-semibold uppercase tracking-wide text-primary">
				{$page.status} error
			</p>
			<h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
				{$page.error?.message}
			</h1>
			<p class="mt-2 text-base text-gray-500">
				Sorry, we couldn’t find the page you’re looking for.
			</p>
			<div class="mt-6">
				<a href="/" class="text-base font-medium text-primary hover:text-darker-primary"
					>Go back home<span aria-hidden="true"> &rarr;</span></a
				>
			</div>
		</div>
	</div>
</div>
