import ky, { HTTPError } from 'ky';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

export type PostType = {
	id: string;
	title: string;
	body: string;
};

export const fetchPost = createServerFn({ method: 'GET' })
	.validator((postId: string) => postId)
	.handler(async ({ data }) => {
		console.info(`Fetching post with id ${data}...`);
    try {
      const post = await ky
        .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
        .json()

      return post;

    } catch (error) {
      if (error instanceof HTTPError) {
        console.error(`Error fetching post with id ${data}:`, error.response);
        throw notFound();
      }

      console.error(`Unexpected error fetching post with id ${data}:`, error);
    }
	});

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async () => {
	console.info('Fetching posts...');
	await new Promise((r) => setTimeout(r, 1000));
	return ky
		.get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
		.json()
		.then((data) => data.slice(0, 20));
});
