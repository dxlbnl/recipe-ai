<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	export let id: string;

	let state = 'pending';
	let done = false;
	let error: string | null = null;

	onMount(() => {
		const source = new EventSource(`/api/process-recipe/${id}`);

		source.addEventListener('error', (e: MessageEvent) => {
			console.error('error', e);
			error = e.data;
		});
		source.addEventListener('update', (e) => {
			// console.log(e.data);
			state = e.data;
		});
		source.addEventListener('done', (e) => {
			console.log('DONE', e.data);
			done = true;
			source.close();
			invalidateAll();
		});
	});
</script>

{#if error}
	{error}
{:else if done}
	Done
{:else}
	{state}
{/if}
