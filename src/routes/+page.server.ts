import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const url = form.get('url');

		if (!url) {
			return error(400);
		}

		// TODO log the user in
	}
} satisfies Actions;
