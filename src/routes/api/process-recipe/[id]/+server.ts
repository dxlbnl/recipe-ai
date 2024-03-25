import { type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { recipes } from '$lib/db/schema';

import { eq } from 'drizzle-orm';

import 'dotenv/config';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
// Only required in a Deno notebook environment to load the peer dep.
import 'cheerio';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { resultSchema } from '$lib/schemas';

const SYSTEM_PROMPT_TEMPLATE = [
	'You are an expert at reading recipes in text.',
	'Extract all relevant information on the recipe. Extract nothing if no important information can be found in the text.'
].join('\n');

// Define a custom prompt to provide instructions and any additional context.
// 1) You can add examples into the prompt template to improve extraction quality
// 2) Introduce additional parameters to take context into account (e.g., include metadata
//    about the document from which the text was extracted.)
const prompt = ChatPromptTemplate.fromMessages([
	['system', SYSTEM_PROMPT_TEMPLATE],
	// Keep on reading through this use case to see how to use examples to improve performance
	// MessagesPlaceholder('examples'),
	['human', '{text}']
]);

// We will be using tool calling mode, which
// requires a tool calling capable model.
const llm = new ChatOpenAI({
	modelName: 'gpt-4-0125-preview',
	temperature: 0
});
const extractionChain = prompt.pipe(llm.withStructuredOutput(resultSchema));

export const config = {
	runtime: 'nodejs20.x'
};

const event = (type: string, data: string) => {
	return `event: ${type}\ndata: ${data}\n\n`;
};

async function* processRecipe(id: string) {
	// Resolve recipe from db
	try {
		const dbresult = await db.select({ url: recipes.url }).from(recipes).where(eq(recipes.id, id));
		const url = dbresult.at(0)?.url;

		if (!url) {
			yield event('error', 'unknown url');
			console.error(`Error resolving url`);

			return;
		}
		yield event('update', 'resolved url');

		// Request html

		console.log('Loading url', url);
		const loader = new CheerioWebBaseLoader(url);
		const docs = await loader.load();

		yield event('update', 'received html');
		yield event('update', 'Extracting recipe');

		// Process html with GPT
		console.log('Got data, extracting recipe');
		const response = await extractionChain.invoke({ text: docs[0].pageContent });

		if (response.error) {
			yield event('error', `Error extracting ${response.error}`);
			console.error(`Error extracting ${response.error}`);
			return;
		}

		yield event('update', `Extracted recipe data for ${response.result?.name}`);

		console.log('Saving recipe');

		if (response.result) {
			await db
				.update(recipes)
				.set({
					name: response.result.name,
					steps: response.result.steps,
					portions: response.result.portions,
					tags: response.result.tags,
					ingredients: response.result.ingredients,
					url: url
				})
				.where(eq(recipes.id, id));
		}
		yield event('done', `Done processing`);
	} catch (e) {
		console.error(e);
	}
}

export const GET: RequestHandler = ({ params }) => {
	if (!params.id) {
		return new Response('no id found', { status: 400 });
	}

	console.log('processing', params.id);

	return new Response(ReadableStream.from(processRecipe(params.id)), {
		headers: {
			'cache-control': 'no-cache',
			'content-disposition': 'inline',
			'content-type': 'text/event-stream'
		}
	});
};
