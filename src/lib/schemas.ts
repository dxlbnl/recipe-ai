import z from 'zod';

// Define outside the load function so the adapter can be cached
export const urlSchema = z.object({
	url: z.string().url()
});

export const ingredientsSchema = z.string().array().describe('The list of ingredients');

export const recipeSchema = z.object({
	name: z.string().describe('A concise descriptive name for the recipe'),
	ingredients: z
		.union([
			ingredientsSchema.describe('If the ingredients are a plain list'),
			z
				.record(z.string().describe('The name of the group of ingredients'), ingredientsSchema)
				.describe('If ingredients are grouped in the source keep the grouping.')
		])
		.describe("Follow the source's grouping"),

	steps: z.union([
		z.array(z.string()).describe('The steps of the recipe.'),
		z
			.record(
				z.string().describe('Name of the group of steps'),
				z.array(z.string()).describe('The steps of the recipe.')
			)
			.describe('If steps are grouped in the source keep the grouping.')
	])
});
export type Recipe = z.infer<typeof recipeSchema>;

export const resultSchema = z.object({
	result: recipeSchema.optional().describe("Only fill this object when there's data"),
	error: z.string().describe('Reason why not able to fill result.')
});
