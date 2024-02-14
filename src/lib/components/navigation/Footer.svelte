<script lang="ts">
	import { Logo } from '$lib/components';
	import { Github } from 'lucide-svelte';
</script>

<footer>
	<div class="container flex flex-col gap-4 py-24">
		<Logo />

		<div class="flex flex-col justify-between gap-x-12 gap-y-4 text-center md:flex-row">
			<p class="text-sand-12 text-center text-sm leading-tight md:text-left">
				© 2024 Interview. All rights reserved.
				<a class="underline hover:text-black" href="/privacy-policy">Privacy policy</a>
			</p>
			<p class="text-sand-12 text-center text-sm leading-tight md:text-right">
				Made with <span class="text-[#ff3838]">♥</span> by Aljon Lerios.
			</p>
		</div>
	</div>
</footer>
