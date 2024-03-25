import type { RequestHandler } from '@sveltejs/kit';

export const config = {
	runtime: 'nodejs'
};

// POST url: -> return uuid
//
const sleep = (time = 200) => new Promise((resolve) => setTimeout(resolve, time));

async function* processRecipe(id: string) {
	await sleep();
	yield ['id: 0', 'event: test'].join('\n') + '\n\n';
	await sleep();
	yield ['id: 1', 'event: test'].join('\n') + '\n\n';
	await sleep();
	yield ['id: 2', 'event: test'].join('\n') + '\n\n';
	await sleep();
	yield ['id: 3', 'event: test'].join('\n') + '\n\n';
	await sleep();
	yield ['id: 4', 'event: test'].join('\n') + '\n\n';
	await sleep();
	yield ['id: 5j', 'event: test'].join('\n') + '\n\n';
}

export const GET: RequestHandler = ({ params }) => {
	if (!params.id) {
		return new Response('no id found', { status: 400 });
	}

	return new Response(ReadableStream.from(processRecipe(params.id)), {
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'text/event-stream'
		}
	});
};
