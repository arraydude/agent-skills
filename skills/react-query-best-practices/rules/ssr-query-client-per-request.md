---
title: Create One QueryClient per Request on the Server
impact: CRITICAL
impactDescription: a module-level client shares cached data, including private data, between all users
tags: ssr, nextjs, queryclient, hydration, security
versions: v4, v5
---

## Create One QueryClient per Request on the Server

When server rendering, create the `QueryClient` inside your app, never at module scope. A module-level client is shared by every request on the server, so all data goes to all users. That hurts performance and leaks sensitive data. In the browser, reuse a single client.

**Incorrect (module scope: shared across requests on the server):**

```typescript
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

**Correct (v5): new client per server request, singleton in the browser**

```typescript
'use client';
import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient(); // v5 before 5.91: `isServer`
  // Keep one browser client so it is not recreated if React suspends during the first render
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

**Correct (v4, and v5 pages-router style setups): client in React state**

```typescript
export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

- `environmentManager.isServer()` was added in 5.91, and the `isServer` constant is deprecated in its favour.
- Avoid `useState` for the client when there is no `<Suspense>` boundary between the provider and code that may suspend. React throws the client away if the first render suspends.
- In Server Components, `cache(() => new QueryClient())` from `react` gives one client per request.

Reference: [Server Rendering & Hydration](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#initial-setup), [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#initial-setup), [v4 SSR](https://tanstack.com/query/v4/docs/framework/react/guides/ssr)
