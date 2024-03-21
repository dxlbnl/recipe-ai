import { pgTable, integer, jsonb, varchar } from 'drizzle-orm/pg-core';
import { type Recipe } from '$lib/schemas';

export const recipes = pgTable('recipes', {
	slug: varchar('slug').primaryKey(),
	name: varchar('name'),
	url: varchar('url').unique(),
	rating: integer('rating'),
	tags: jsonb('tags'),
	portions: integer('portions'),
	ingredients: jsonb('ingredients').$type<Recipe['ingredients']>(),
	steps: jsonb('steps').$type<Recipe['steps']>()
});
