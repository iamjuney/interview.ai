<div class="fixed -z-50 min-h-dvh w-full">
	<!-- <div
		class="absolute inset-0 -z-10"
		style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2264%22 height=%2264%22 fill=%22none%22 stroke=%22rgb(148%20163%20184%20/%200.03)%22%3E%3Cpath d=%22M0%20.5H31.5V32%22 /%3E%3C/svg%3E'); background-repeat: repeat;"
	></div> -->
	<div
		class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
		aria-hidden="true"
	>
		<div
			class="custom-path relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
		></div>
	</div>
	<div
		class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
		aria-hidden="true"
	>
		<div
			class="custom-path relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
		></div>
	</div>
</div>

<style>
	.custom-path {
		clip-path: polygon(
			74.1% 44.1%,
			100% 61.6%,
			97.5% 26.9%,
			85.5% 0.1%,
			80.7% 2%,
			72.5% 32.5%,
			60.2% 62.4%,
			52.4% 68.1%,
			47.5% 58.3%,
			45.2% 34.5%,
			27.5% 76.7%,
			0.1% 64.9%,
			17.9% 100%,
			27.6% 76.8%,
			76.1% 97.7%,
			74.1% 44.1%
		);
		animation: animatePolygon 5s infinite alternate;
	}

	@keyframes animatePolygon {
		0% {
			clip-path: polygon(
				74.1% 44.1%,
				100% 61.6%,
				97.5% 26.9%,
				85.5% 0.1%,
				80.7% 2%,
				72.5% 32.5%,
				60.2% 62.4%,
				52.4% 68.1%,
				47.5% 58.3%,
				45.2% 34.5%,
				27.5% 76.7%,
				0.1% 64.9%,
				17.9% 100%,
				27.6% 76.8%,
				76.1% 97.7%,
				74.1% 44.1%
			);
		}

		50% {
			clip-path: polygon(
				70% 40%,
				92% 60%,
				97% 30%,
				82% 0%,
				75% 5%,
				70% 30%,
				58% 65%,
				50% 70%,
				45% 50%,
				40% 30%,
				25% 75%,
				5% 65%,
				20% 95%,
				30% 70%,
				75% 100%,
				70% 40%
			);
		}

		100% {
			clip-path: polygon(
				74.1% 44.1%,
				80% 61.6%,
				97.5% 26.9%,
				85.5% 0.1%,
				80.7% 2%,
				72.5% 32.5%,
				60.2% 62.4%,
				52.4% 68.1%,
				47.5% 58.3%,
				45.2% 34.5%,
				27.5% 76.7%,
				0.1% 64.9%,
				17.9% 80%,
				27.6% 76.8%,
				76.1% 97.7%,
				74.1% 44.1%
			);
		}
	}
</style>
