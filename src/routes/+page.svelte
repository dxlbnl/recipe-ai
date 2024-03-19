<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, message, enhance } = superForm(data.form);
</script>

<main>
	{#if $message}<h3>{$message}</h3>{/if}

	<form method="POST" use:enhance>
		<label>
			URL:
			<input
				type="text"
				name="url"
				aria-invalid={$errors.url ? 'true' : undefined}
				bind:value={$form.url}
			/>
		</label>
		{#if $errors.url}<span class="invalid">{$errors.url}</span>{/if}

		<button>Submit</button>
	</form>
</main>

<style>
	.invalid {
		color: red;
	}

	main {
		height: 100dvh;
		display: grid;
		place-items: center;
	}
</style>
