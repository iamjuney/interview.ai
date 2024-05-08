<script lang="ts">
	import { VisLine, VisScatter, VisXYContainer, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import {
		color,
		scatterPointColors,
		scatterPointStrokeColors,
		crosshairPointColors,
		tooltipTemplate
	} from '../helpers';

	const data = [
		{ id: 1, users: 10400 },
		{ id: 2, users: 14405 },
		{ id: 3, users: 9400 },
		{ id: 4, users: 8200 },
		{ id: 5, users: 7000 },
		{ id: 6, users: 9600 },
		{ id: 7, users: 11244 },
		{ id: 8, users: 26475 },
		{ id: 9, users: 14400 },
		{ id: 10, users: 10400 },
		{ id: 11, users: 14405 },
		{ id: 12, users: 9400 }
	];
	const x = (d: { users: number; id: number }) => d.id;
	const y = (d: { users: number; id: number }) => d.users;
</script>

<VisXYContainer {data} height="128">
	<VisTooltip />
	<VisLine {x} {y} color={color()} />
	<VisScatter
		{x}
		{y}
		size={6}
		color={scatterPointColors}
		strokeColor={scatterPointStrokeColors}
		strokeWidth={2}
	/>
	<VisCrosshair template={tooltipTemplate} color={crosshairPointColors} />
</VisXYContainer>
