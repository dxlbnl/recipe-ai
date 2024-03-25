import { pgTable, integer, jsonb, varchar, uuid } from 'drizzle-orm/pg-core';
import { type Recipe } from '$lib/schemas';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const recipes = pgTable('recipes', {
	id: uuid('id').defaultRandom().primaryKey(),
	slug: varchar('slug').unique(),
	name: varchar('name'),
	url: varchar('url').unique(),
	rating: integer('rating'),
	tags: jsonb('tags'),
	portions: integer('portions'),
	ingredients: jsonb('ingredients').$type<Recipe['ingredients']>(),
	steps: jsonb('steps').$type<Recipe['steps']>()
});

export const insertRecipeSchema = createInsertSchema(recipes);
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export const selectRecipeSchema = createSelectSchema(recipes);
export type SelectRecipe = z.infer<typeof selectRecipeSchema>;
