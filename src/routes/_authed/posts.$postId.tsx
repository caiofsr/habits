import { createFileRoute } from '@tanstack/react-router';
import { NotFound } from '@components/NotFound';
import { fetchPost } from '@/utils/posts';
import { PostErrorComponent } from '@/components/PostErrorComponent';

export const Route = createFileRoute('/_authed/posts/$postId')({
	loader: ({ params: { postId } }) => fetchPost({ data: postId }),
	errorComponent: PostErrorComponent,
	component: PostComponent,
	notFoundComponent: () => {
		return <NotFound>Post not found</NotFound>;
	},
});

function PostComponent() {
	const post = Route.useLoaderData();

	return (
		<div className="space-y-2">
			<h4 className="text-xl font-bold underline">{post.title}</h4>
			<div className="text-sm">{post.body}</div>
		</div>
	);
}
