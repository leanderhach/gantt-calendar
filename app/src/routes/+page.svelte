<script lang="ts">
	import {
		gapiLoaded,
		gsiTokenClient,
		usingGcal,
	} from "$lib/store/calendarHosts";
	import { handleAuthClick, initGapi } from "$lib/utils/google";

	let googleSignedIn = false;

	async function toggleGcal() {
		$usingGcal = !$usingGcal;
	}

	$: $gapiLoaded, trySignInGoogle();
	$: $gsiTokenClient, trySignInGoogle();

	async function trySignInGoogle() {
		console.log("now trying....");
		if ($usingGcal && $gapiLoaded && $gsiTokenClient && !googleSignedIn) {
			console.log("continuing");
			// await timeout of 1 second
			await new Promise((r) => setTimeout(r, 1000));
			handleAuthClick();
			googleSignedIn = true;
		}
	}
</script>

hi there

<button on:click={toggleGcal}>Connect Google Calendar</button>
