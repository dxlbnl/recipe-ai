<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ProcessRecipe from './ProcessRecipe.svelte';

	export let data: PageData;

	const { form, errors, message, enhance, submitting } = superForm(data.form);
</script>

<main>
	<ul>
		{#each data.allRecipes as recipe}
			<li>
				{#if recipe.name}
					<a href="/{recipe.slug}">{recipe.name}</a>
				{:else}
					<ProcessRecipe id={recipe.id} />
				{/if}
			</li>
		{/each}
	</ul>

	{#if $message}<h3>{$message}</h3>{/if}

	<form method="POST" use:enhance>
		<section>
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

			<label>
				Process immediately
				<input type="checkbox" name="processImmediately" bind:checked={$form.processImmediately} />
			</label>

			<button disabled={$submitting}>Submit</button>
		</section>
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

	section {
		display: grid;
	}
</style>
