<script lang="ts">
	import { onMount } from 'svelte';

	let { score } = $props<{ score: number }>();

	let canvas = $state<HTMLCanvasElement>();
	let ctx = $state<CanvasRenderingContext2D | null>();
	let data = [score, 100 - score]; // your data
	let colors = ['#7936EC', '#ffffff']; // colors for each data point
	let total = data.reduce((a, b) => a + b, 0);

	onMount(() => {
		if (canvas) {
			ctx = canvas?.getContext('2d');
			let startAngle = -Math.PI / 2; // rotate left by 90 degrees
			let radius = Math.min(canvas.width / 2, canvas.height / 2);
			let innerRadius = radius * 0.75; // set the inner radius to half of the outer radius

			for (let i = 0; i < data.length; i++) {
				let sliceAngle = (2 * Math.PI * data[i]) / total;
				drawSlice(
					ctx!,
					canvas.width / 2,
					canvas.height / 2,
					radius,
					innerRadius, // pass the inner radius to the drawSlice function
					startAngle,
					startAngle + sliceAngle,
					colors[i]
				);
				startAngle += sliceAngle;
			}
		}
	});

	function drawSlice(
		ctx: CanvasRenderingContext2D,
		centerX: number,
		centerY: number,
		radius: number,
		innerRadius: number, // add innerRadius parameter
		startAngle: number,
		endAngle: number,
		color: string
	) {
		if (ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, startAngle, endAngle);
			ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true); // draw the inner circle
			ctx.closePath();
			ctx.fill();
		}
	}
</script>

<div class="relative size-52">
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
		<h1 class="text-3xl font-bold">{score}</h1>
		<p class="text-sm">of 100</p>
	</div>
	<canvas bind:this={canvas} width="208" height="208"></canvas>
</div>
