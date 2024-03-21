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

export async function formatRecipe(url: string) {
	console.log('Loading url', url);
	const loader = new CheerioWebBaseLoader(url);

	const docs = await loader.load();
	console.log('Got data, extracting recipe');

	const result = await extractionChain.invoke({ text: docs[0].pageContent });
	console.log('Done extracting recipe', result.error);
	return result;
}

// formatRecipe('https://www.lowcarbchef.nl/recept/mexicaans-stoofvlees');
// formatRecipe('https://www.lowcarbchef.nl/recept/panna-cotta-met-pistachecreme');
// formatRecipe('https://www.lowcarbchef.nl/recept/groene-groente-frittata');
