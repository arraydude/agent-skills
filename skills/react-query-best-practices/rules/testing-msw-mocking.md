---
title: Mock the Network, Not useQuery
impact: HIGH
impactDescription: tests exercise the real hook, cache and error paths
tags: testing, msw, mocking, network
versions: v4, v5
---

## Mock the Network, Not useQuery

Test your custom hooks against a mocked network layer (MSW, or nock as the TanStack docs use) instead of mocking `useQuery`. The query function, the cache and the status transitions then run for real. The React Query code is the same in v4 and v5; the split below is between MSW majors.

**Incorrect (mocking the library):**

```typescript
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [{ id: 1 }], isSuccess: true }),
}));
```

**Correct (MSW 2.x):**

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/todos', () =>
    HttpResponse.json([{ id: 1, title: 'Todo 1', done: false }]),
  ),
];

// setupTests.ts
import { setupServer } from 'msw/node';
export const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// todos.test.tsx
it('handles error state', async () => {
  server.use(
    http.get('/api/todos', () =>
      HttpResponse.json({ message: 'boom' }, { status: 500 }),
    ),
  );
  const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
  await waitFor(() => expect(result.current.isError).toBe(true));
});
```

**Correct (MSW 1.x, legacy):**

```typescript
import { rest } from 'msw';

rest.get('/api/todos', (req, res, ctx) => res(ctx.json([{ id: 1 }])));
rest.get('/api/todos', (req, res, ctx) => res(ctx.status(500)));
```

- An error test only reaches `isError` quickly if retries are off (see `testing-fresh-client`), and only if the `queryFn` rejects on non-2xx responses (see `troubleshoot-fetch-not-reject`).
- Use `waitFor` until the status says the request settled before asserting on `data`.

Reference: [Testing](https://tanstack.com/query/v5/docs/framework/react/guides/testing) · [v4 Testing](https://tanstack.com/query/v4/docs/framework/react/guides/testing) · [MSW http](https://mswjs.io/docs/api/http)
