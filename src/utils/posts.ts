import ky, { HTTPError } from 'ky';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { tryCatch } from './tryCatch';

export type PostType = {
	id: string;
	title: string;
	body: string;
};

export const fetchPost = createServerFn({ method: 'GET' })
	.validator((postId: string) => postId)
	.handler(async ({ data }) => {
		console.info(`Fetching post with id ${data}...`);

    const [ok, error, post] = await tryCatch(
      ky.get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`).json()
    );

    if (!ok && error instanceof HTTPError) {
      console.error(`Error fetching post with id ${data}:`, error);
      throw notFound();
    }

    return post;
	});

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async () => {
	console.info('Fetching posts...');
	await new Promise((r) => setTimeout(r, 1000));
  const [ok, error, posts] = await tryCatch(
    ky.get<PostType[]>('https://jsonplaceholder.typicode.com/posts').json()
  );

  if (!ok && error instanceof HTTPError) {
    console.error('Error fetching posts:', error);
    throw notFound();
  }

  return posts?.slice(0, 20) || []; // Return the first 20 posts or an empty array if none found
});
