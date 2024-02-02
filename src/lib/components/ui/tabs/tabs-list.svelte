<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		'inline-flex h-9 items-center justify-center rounded-lg bg-primary p-1 text-primary-foreground',
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
