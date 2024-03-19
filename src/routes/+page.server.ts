import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { urlSchema } from '$lib/schemas';
import { formatRecipe } from '$lib/recipe-ai';

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

		// TODO: Do something with the validated form.data
		console.log(form.data.url);
		formatRecipe(form.data.url);

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
} satisfies Actions;
