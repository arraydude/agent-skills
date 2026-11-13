---
title: Type the queryFn, Let TypeScript Infer the Rest
impact: MEDIUM
impactDescription: cleaner code, inference keeps working for select, data and cache reads
tags: typescript, inference, generics, queryOptions, mutationOptions
versions: v4, v5
---

## Type the queryFn, Let TypeScript Infer the Rest

Give the `queryFn` a well-defined return type and let the hook infer `data`. Explicit generics turn off inference for the remaining type parameters, and most fetch libraries return `any`, so the typed function is what carries the type.

**Incorrect (explicit generics, untyped fetcher):**

```typescript
const { data } = useQuery<Todo[], Error>({
  queryKey: ['todos'],
  queryFn: () => axios.get('/api/todos').then((res) => res.data), // any
});
```

**Correct (typed function, inferred hook):**

```typescript
const fetchTodos = (): Promise<Todo[]> =>
  axios.get('/api/todos').then((res) => res.data);

const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
// data: Todo[] | undefined

const { data: count } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (todos) => todos.length,
});
// count: number | undefined
```

**Correct (v5): share options with `queryOptions` / `mutationOptions`:**

```typescript
import { queryOptions, mutationOptions } from '@tanstack/react-query';

const todoOptions = (id: number) =>
  queryOptions({
    queryKey: ['todos', 'detail', id],
    queryFn: () => fetchTodo(id),
  });

useQuery(todoOptions(5));
const cached = queryClient.getQueryData(todoOptions(5).queryKey);
// cached: Todo | undefined (the key is tagged with the queryFn's type)

const addTodoOptions = () =>
  mutationOptions({ mutationKey: ['addTodo'], mutationFn: addTodo });

useMutation({
  ...addTodoOptions(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

**Correct (v4): no options helpers, so pass a generic when reading the cache:**

```typescript
const todoKeys = {
  detail: (id: number) => ['todos', 'detail', id] as const,
};

useQuery({ queryKey: todoKeys.detail(5), queryFn: () => fetchTodo(5) });
const cached = queryClient.getQueryData<Todo>(todoKeys.detail(5));
```

- Inference from `queryOptions` does not reach `getQueriesData`, which returns heterogeneous tuples. Pass the generic there.
- `mutationOptions` was added to React Query in 5.82. `queryOptions` has been available since 5.0.
- To narrow errors, use type guards such as `axios.isAxiosError(error)` rather than a `TError` generic. See `typescript-register-global-types` to change the error type globally.

Reference: [TypeScript](https://tanstack.com/query/v5/docs/framework/react/typescript) · [v4 TypeScript](https://tanstack.com/query/v4/docs/framework/react/typescript)
