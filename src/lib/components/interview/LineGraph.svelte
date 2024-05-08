<script lang="ts">
	import { VisLine, VisScatter, VisXYContainer, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import {
		color,
		scatterPointColors,
		scatterPointStrokeColors,
		crosshairPointColors,
		tooltipTemplate
	} from '../helpers';

	let { data } = $props();

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
