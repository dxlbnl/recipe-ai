<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>{data.recipe.name}</h1>

<p>Portions: {data.recipe.portions}</p>
<ul>
	{#each data.recipe.tags as tag}
		<li>{tag}</li>
	{/each}
</ul>

<ul>
	{#each data.recipe.ingredients as ingredient}
		<li>{ingredient}</li>
	{/each}
</ul>

{#each data.recipe.steps as step}
	<p>{step}</p>
{/each}
