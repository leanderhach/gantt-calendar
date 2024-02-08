<script lang="ts">
	import { usingGcal } from "$lib/store/calendarHosts";
	import { initGapi, initGsi } from "$lib/utils/google";
</script>

<svelte:head>
	{#if $usingGcal}
		<script src="https://apis.google.com/js/api.js" on:load={initGapi}></script>
		<script
			src="https://accounts.google.com/gsi/client"
			on:load={initGsi}
		></script>
	{/if}
</svelte:head>

{$usingGcal}
<slot />
