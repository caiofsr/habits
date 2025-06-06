import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from '@tanstack/react-query';
import { ConvexProvider } from 'convex/react';
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

export function createRouter() {
	const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string
	if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL");
  }
	const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

	const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);


	const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient },
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
			defaultErrorComponent: DefaultCatchBoundary,
			defaultNotFoundComponent: () => <NotFound />,
			scrollRestoration: true,
    }),
    queryClient,
  );

	return router;
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
