<script lang="ts">
	import { VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import { GroupedBar } from '@unovis/ts';
	import { color, crosshairPointColors, tooltipTemplate } from '../helpers';

	type DataRecord = {
		id: number;
		subscription: number;
	};

	const data: DataRecord[] = [
		{
			id: 1,
			subscription: 240
		},
		{
			id: 2,
			subscription: 300
		},
		{
			id: 3,
			subscription: 200
		},
		{
			id: 4,
			subscription: 278
		},
		{
			id: 5,
			subscription: 189
		},
		{
			id: 6,
			subscription: 239
		},
		{
			id: 7,
			subscription: 278
		},
		{
			id: 8,
			subscription: 189
		},
		{
			id: 9,
			subscription: 239
		},
		{
			id: 10,
			subscription: 278
		},
		{
			id: 11,
			subscription: 189
		},
		{
			id: 12,
			subscription: 239
		}
	];
	const x = (d: { subscription: number; id: number }) => d.id;
	const y = (d: { subscription: number; id: number }) => d.subscription;
	const triggers = { [GroupedBar.selectors.bar]: (d: any) => d.subscription };
</script>

<VisXYContainer {data} height={128}>
	<VisGroupedBar {x} {y} roundedCorners={16} color={color()} />
	<VisTooltip />
	<VisCrosshair template={tooltipTemplate} color={crosshairPointColors} />
</VisXYContainer>
