import 'dotenv/config'
import OpenAI from 'openai';
import z from 'zod'
import { printNode, zodToTs } from "zod-to-ts";

const ingredientsSchema = z.string().array().describe('The list of ingredients')

const recipeSchema = z.object({
  name: z.string()
    .describe("A concise descriptive name for the recipe"),
  portions: z.number().describe('The amount of portions the recipe is sized for'),
  ingredients: z.union([
    ingredientsSchema.describe('If the ingredients are a plain list'),
    z.record(
      z.string().describe('The name of the group of ingredients'),
      ingredientsSchema
    ).describe('If ingredients are grouped in the source keep the grouping.'),
  ]).describe("Follow the source's grouping"),
  
  steps: z.union([
    z.array(z.string())
    .describe("The steps of the recipe."),
    z.record(
      z.string().describe('Name of the group of steps'),
      z.array(z.string())
      .describe("The steps of the recipe.")
    ).describe('If steps are grouped in the source keep the grouping.'),
  ])
})

const resultSchema = z.object({
  result: recipeSchema.optional().describe("Only fill this object when there's data"),
  error: z.string().describe('Reason why not able to fill result.')
})


const openai = new OpenAI();

async function formatRecipe(url) {
  const response = await fetch(url)
  if (!response.ok) {
    console.error(`Failed to fetch '${url}'`)
  }

  if (!response.headers.get('content-type').startsWith('text/html')) {
    console.warn("body is not html", response.headers.get('content-type') )
  }
  const html = await response.text()

	const completion = await openai.chat.completions.create({
		messages: [
      { role: "system", content: "You are a master at scraping and parsing raw HTML."},
      { role: 'system', content: 'Analyze the webpage and extract all information. Respond only as a JSON document, and strictly conform to the following typescript schema, paying attention to comments as requirements:\n\n' +
        printNode(zodToTs(resultSchema).node) + 'try to structure the data following the provided JSON schema info' },
      { role: 'user', content: html }
    ],
		model: 'gpt-4-turbo-preview',
		// model: 'gpt-3.5-turbo-0125',
    response_format: { "type": "json_object" }
	});

	console.log(completion.choices);
}


// formatRecipe('https://www.lowcarbchef.nl/recept/mexicaans-stoofvlees');
// formatRecipe('https://www.lowcarbchef.nl/recept/panna-cotta-met-pistachecreme');
formatRecipe('https://www.lowcarbchef.nl/recept/koolhydraatarme-moussaka');
