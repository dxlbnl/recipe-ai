import { db } from '$lib/db';
import { recipes } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const [recipe] = await db.select().from(recipes).where(eq(recipes.slug, params.slug));

	// Always return { form } in load functions
	return { recipe };
};
