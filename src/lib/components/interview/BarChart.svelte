<script lang="ts">
	import { VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import { color, crosshairPointColors, tooltipTemplateForBarGraph } from '../helpers';

	let { data } = $props();

	const x = (d: { count: number; id: number }) => d.id;
	const y = (d: { count: number; id: number }) => d.count;
	// const triggers = { [GroupedBar.selectors.bar]: (d: any) => d.subscription };
</script>

<VisXYContainer {data} height={128}>
	<VisGroupedBar {x} {y} roundedCorners={24} color={color()} />
	<VisTooltip />
	<VisCrosshair template={tooltipTemplateForBarGraph} color={crosshairPointColors} />
</VisXYContainer>
