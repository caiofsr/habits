/// <reference types="vite/client" />

import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/tanstack-react-start';
import { getAuth } from '@clerk/tanstack-react-start/server';
import { createRootRoute, createRootRouteWithContext, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import type * as React from 'react';
import { DefaultCatchBoundary } from '@components/DefaultCatchBoundary.js';
import { NotFound } from '@components/NotFound.js';
import appCss from '@/styles/app.css?url';
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
	const { userId } = await getAuth(getWebRequest() as Request);

	return {
		userId,
	};
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
 head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png',
			},
			{ rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
			{ rel: 'icon', href: '/favicon.ico' },
		],
	}),
	beforeLoad: async () => {
		const { userId } = await fetchClerkAuth();

		return {
			userId,
		};
	},
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
});

function RootComponent() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="color-theme">
			<ClerkProvider>
				<RootDocument>
					<Outlet />
				</RootDocument>
			</ClerkProvider>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="p-2 flex gap-2 text-lg">
					<Link
						to="/"
						activeProps={{
							className: 'font-bold',
						}}
						activeOptions={{ exact: true }}
					>
						Home
					</Link>{ ' ' }
					<Link
						to="/posts"
						activeProps={{
							className: 'font-bold',
						}}
					>
						Posts
					</Link>
					<div className="ml-auto flex items-center gap-2">
						<ModeToggle />
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<SignInButton mode="modal" />
						</SignedOut>
					</div>
				</div>
				<hr />
				{children}
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
