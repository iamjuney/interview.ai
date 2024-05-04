<script lang="ts">
	import { VisLine, VisScatter, VisXYContainer } from '@unovis/svelte';
	import { color, scatterPointColors, scatterPointStrokeColors } from '../helpers';

	const data = [
		{ id: 1, points: 10400 },
		{ id: 2, points: 14405 },
		{ id: 3, points: 9400 },
		{ id: 4, points: 8200 },
		{ id: 5, points: 7000 },
		{ id: 6, points: 9600 },
		{ id: 7, points: 11244 },
		{ id: 8, points: 26475 },
		{ id: 9, points: 14400 },
		{ id: 10, points: 10400 },
		{ id: 11, points: 14405 },
		{ id: 12, points: 9400 }
	];
	const x = (d: { points: number; id: number }) => d.id;
	const y = (d: { points: number; id: number }) => d.points;
</script>

<VisXYContainer {data} height="80">
	<VisLine {x} {y} color={color()} />
	<VisScatter
		{x}
		{y}
		size={6}
		color={scatterPointColors}
		strokeColor={scatterPointStrokeColors}
		strokeWidth={2}
	/>
</VisXYContainer>
