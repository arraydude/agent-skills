---
title: Fetch Not Rejecting on Errors
impact: HIGH
impactDescription: HTTP errors otherwise land in the cache as successful data
tags: troubleshoot, fetch, error, http, queryFn
versions: v4, v5
---

## Fetch Not Rejecting on Errors

A query fails only when its `queryFn` throws or returns a rejected promise. `fetch` resolves on 4xx/5xx responses, so check `response.ok` and throw. Otherwise the error body is cached as data, `error` stays `null`, and retries never run.

**Incorrect (404 treated as success):**

```typescript
useQuery({
  queryKey: ['user', id],
  queryFn: () => fetch(`/api/users/${id}`).then((res) => res.json()),
});
```

**Correct (throw on non-OK responses):**

```typescript
useQuery({
  queryKey: ['user', id],
  queryFn: async () => {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
  },
});
```

**Correct (a client that rejects by itself, e.g. axios or graphql-request):**

```typescript
useQuery({
  queryKey: ['user', id],
  queryFn: () => axios.get(`/api/users/${id}`).then((res) => res.data),
});
```

- Return a value from the `queryFn`. Resolving `undefined` is treated as a failure, so resolve `null` to cache "nothing". The ESLint rule `no-void-query-fn` catches missing returns (requires typed linting).
- Errors are retried 3 times with exponential backoff on the client before `error` is set. In v5 the in-progress error is exposed as `failureReason` until the last attempt.
- v5 types `error` as `Error` by default (v4: `unknown`). If you throw something other than an `Error`, set the generic or register a global error type.

Reference: [Query Functions](https://tanstack.com/query/v5/docs/framework/react/guides/query-functions) · [Query Retries](https://tanstack.com/query/v5/docs/framework/react/guides/query-retries) · [v4 Query Functions](https://tanstack.com/query/v4/docs/framework/react/guides/query-functions)
