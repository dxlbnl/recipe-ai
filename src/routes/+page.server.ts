import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { urlSchema } from '$lib/schemas';
import { formatRecipe } from '$lib/recipe-ai';

import { db } from '$lib/db';
import { recipes } from '$lib/schema';

export const load = async () => {
	const form = await superValidate(zod(urlSchema));

	// Always return { form } in load functions
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(urlSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		console.log(form.data.url);
		const { result, error } = await formatRecipe(form.data.url);

		if (!result) {
			console.log('Failed to find recipe', error);
			return fail(404, { form });
		}

		console.log('recopes', result);
		await db.insert(recipes).values({
			slug: '',
			name: result.name,
			steps: result.steps,
			portions: result.portions,
			tags: result.tags,
			ingredients: result.ingredients,
			url: form.data.url
		});

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
} satisfies Actions;
