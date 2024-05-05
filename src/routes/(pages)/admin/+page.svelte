<script lang="ts">
	import { LineGraph, BarChart, Metric, Tabs, DropdownMenu, Button, Card, Table, Badge } from '$lib/components';
	import { MonitorCheck, ListFilter, File } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let animate = $state(false);

	$effect(() => {
		animate = true;
	});

	const flyOptions = {
		y: 30,
		delay: 300,
		easing: backOut
	};
</script>

{#if animate}
	<div class="container flex flex-col space-y-12 pb-20 md:pt-10" in:fly={flyOptions}>
		<h2 class="truncate text-3xl font-medium tracking-tight">Dashboard</h2>

		<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-3" id="Analytics">
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<LineGraph />
				</div>
			</div>
			<div class="rounded-xl border bg-background shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground/80">New Registrations</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+180.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<BarChart />
				</div>
			</div>
			<div class="rounded-xl border bg-background shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground/80">Top Skills Assessed</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+180.1% from last month</p>
				</div>
				<div class="h-[80px] px-6">
					<LineGraph />
				</div>
			</div>
		</div>

		<!-- <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-32 px-6">
					<Metric />
				</div>
			</div>
			<div class="rounded-xl border bg-background pb-6 shadow">
				<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
					<h3 class="font-medium tracking-tight text-muted-foreground">Active Users</h3>
					<MonitorCheck class="size-5" />
				</div>
				<div class="p-6 pt-0">
					<div class="text-3xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</div>
				<div class="h-32 px-6">
					<Metric />
				</div>
			</div>
		</div> -->

        <Tabs.Root value="week">
          <div class="flex items-center">
            <Tabs.List>
              <Tabs.Trigger value="week">Week</Tabs.Trigger>
              <Tabs.Trigger value="month">Month</Tabs.Trigger>
              <Tabs.Trigger value="year">Year</Tabs.Trigger>
            </Tabs.List>
            <div class="ml-auto flex items-center gap-2">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button
                    variant="outline"
                    size="sm"
                    class="h-7 gap-1 text-sm"
                    builders={[builder]}
                  >
                    <ListFilter class="h-3.5 w-3.5" />
                    <span class="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Label>Filter by</DropdownMenu.Label>
                  <DropdownMenu.Separator />
                  <DropdownMenu.CheckboxItem checked>
                    Fulfilled
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem>Declined</DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem>Refunded</DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <!-- <Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
                <File class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only">Export</span>
              </Button> -->
            </div>
          </div>
          <Tabs.Content value="week">
            <Card.Root
              data-x-chunk-name="dashboard-05-chunk-3"
              data-x-chunk-description="A table of recent orders showing the following columns: Customer, Type, Status, Date, and Amount."
            >
              <Card.Header class="px-7">
                <Card.Title>Orders</Card.Title>
                <Card.Description>Recent orders from your store.</Card.Description>
              </Card.Header>
              <Card.Content>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>Customer</Table.Head>
                      <Table.Head class="hidden sm:table-cell">
                        Type
                      </Table.Head>
                      <Table.Head class="hidden sm:table-cell">
                        Status
                      </Table.Head>
                      <Table.Head class="hidden md:table-cell">
                        Date
                      </Table.Head>
                      <Table.Head class="text-right">Amount</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row class="bg-accent">
                      <Table.Cell>
                        <div class="font-medium">Liam Johnson</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          liam@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Sale
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-23
                      </Table.Cell>
                      <Table.Cell class="text-right">$250.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Olivia Smith</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          olivia@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Refund
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="outline">
                          Declined
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-24
                      </Table.Cell>
                      <Table.Cell class="text-right">$150.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Noah Williams</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          noah@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Subscription
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-25
                      </Table.Cell>
                      <Table.Cell class="text-right">$350.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Emma Brown</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          emma@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Sale
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-26
                      </Table.Cell>
                      <Table.Cell class="text-right">$450.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Liam Johnson</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          liam@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Sale
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-23
                      </Table.Cell>
                      <Table.Cell class="text-right">$250.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Liam Johnson</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          liam@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Sale
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-23
                      </Table.Cell>
                      <Table.Cell class="text-right">$250.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Olivia Smith</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          olivia@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Refund
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="outline">
                          Declined
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-24
                      </Table.Cell>
                      <Table.Cell class="text-right">$150.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <div class="font-medium">Emma Brown</div>
                        <div
                          class="hidden text-sm text-muted-foreground md:inline"
                        >
                          emma@example.com
                        </div>
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        Sale
                      </Table.Cell>
                      <Table.Cell class="hidden sm:table-cell">
                        <Badge class="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </Table.Cell>
                      <Table.Cell class="hidden md:table-cell">
                        2023-06-26
                      </Table.Cell>
                      <Table.Cell class="text-right">$450.00</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Card.Content>
            </Card.Root>
          </Tabs.Content>
        </Tabs.Root>
	</div>
{/if}
