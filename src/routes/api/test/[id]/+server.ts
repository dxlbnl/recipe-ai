import { type RequestHandler } from '@sveltejs/kit';

const sleep = (time = 200) => new Promise((resolve) => setTimeout(resolve, time));
const event = (type: string, data: string) => {
	return `event: ${type}\ndata: ${data}\n\n`;
};

async function* processRecipe(id: string) {
	for (let i = 0; i < 10; i++) {
		yield event('update', `test ${i} for ${id}`);
		await sleep();
	}
	yield event('done', 'finished');
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
