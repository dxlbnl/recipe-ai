import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// Only required in a Deno notebook environment to load the peer dep.
import "cheerio";

const loader = new CheerioWebBaseLoader("https://www.lowcarbchef.nl/recept/groene-groente-frittata");

const docs = await loader.load();

console.log(docs)
console.log('docs', docs[0].pageContent.length)