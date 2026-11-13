---
title: Fresh QueryClient Per Test
impact: CRITICAL
impactDescription: test isolation, no cache bleed between tests, no retry timeouts
tags: testing, QueryClient, isolation, retry, gcTime
versions: v4, v5
---

## Fresh QueryClient Per Test

Build a new `QueryClient` and `QueryClientProvider` inside the wrapper factory so each test starts with an empty cache. Turn off retries in the defaults so error-state tests don't time out on the three default retries with exponential backoff.

**Incorrect (one client shared across tests):**

```typescript
const queryClient = new QueryClient(); // cache leaks from test 1 into test 2

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
```

**Correct (v5):**

```typescript
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity, // Jest: avoids "Jest did not exit one second after the test run"
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

it('loads todos', async () => {
  const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

**Correct (v4):**

```typescript
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: Infinity } },
    logger: { log: console.log, warn: console.warn, error: () => {} }, // v4 only
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

- `retry: false` in the defaults is only a fallback. A query that sets its own `retry` still retries in tests.
- Mutations already default to `retry: 0`.
- Setting `gcTime`/`cacheTime` to `Infinity` matches the server default. It is only needed if you set a custom value somewhere.
- v5 removed the `logger` option, and passing it is a type error. v5 logs only in development.
- A single shared wrapper is acceptable only if the client is cleared before every test and tests don't run in parallel.

Reference: [Testing](https://tanstack.com/query/v5/docs/framework/react/guides/testing) · [v4 Testing](https://tanstack.com/query/v4/docs/framework/react/guides/testing)
