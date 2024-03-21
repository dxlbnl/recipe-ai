<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, message, enhance, submitting } = superForm(data.form);
</script>

<main>
	<ul>
		{#each data.allRecipes as recipe}
			<li>
				<a href="/{recipe.slug}">{recipe.name}</a>
			</li>
		{/each}
	</ul>

	{#if $message}<h3>{$message}</h3>{/if}

	<form method="POST" use:enhance>
		<label>
			URL:
			<input
				type="text"
				name="url"
				aria-invalid={$errors.url ? 'true' : undefined}
				bind:value={$form.url}
				disabled={$submitting}
			/>
		</label>
		{#if $errors.url}<span class="invalid">{$errors.url}</span>{/if}

		<button disabled={$submitting}>Submit</button>
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
