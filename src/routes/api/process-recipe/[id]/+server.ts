import type { RequestHandler } from '@sveltejs/kit';

export const config = {
	runtime: 'edge'
};

// POST url: -> return uuid
//

export const GET: RequestHandler = ({ params }) => {
	console.log(params.id);
	return new Response(`Hello from ${process.env.VERCEL_REGION}`);
};
