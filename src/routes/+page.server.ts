import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { urlSchema } from '$lib/schemas';
import { formatRecipe } from '$lib/recipe-ai';

import { db } from '$lib/db';
import { recipes } from '$lib/db/schema';
import { count, eq } from 'drizzle-orm';

export const load = async () => {
	const form = await superValidate(zod(urlSchema));

	const allRecipes = await db
		.select({
			name: recipes.name,
			slug: recipes.slug
		})
		.from(recipes);

	// Always return { form } in load functions
	return { form, allRecipes };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(urlSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const url = form.data.url;

		console.log('- Received url', form.data.url);

		const [{ value }] = await db
			.select({ value: count() })
			.from(recipes)
			.where(eq(recipes.url, url));

		console.log('value', value);

		if (value != 0) {
			console.error('Already known url', url);
			return fail(400, { form });
		}

		if (form.data.processImmediately) {
			const { result, error } = await formatRecipe(url);

			if (!result) {
				console.log('Failed to find recipe', error);
				return fail(404, { form });
			}

			console.log('- Recipes', result);
			const [newForm] = await db
				.insert(recipes)
				.values({
					name: result.name,
					steps: result.steps,
					portions: result.portions,
					tags: result.tags,
					ingredients: result.ingredients,
					url: url
				})
				.returning();

			form.data.newForm = newForm.id;
		} else {
			const [newForm] = await db
				.insert(recipes)
				.values({
					url: url
				})
				.returning();
			form.data.newForm = newForm.id;
		}

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
} satisfies Actions;
