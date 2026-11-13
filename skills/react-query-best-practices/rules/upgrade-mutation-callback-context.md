---
title: Use onMutateResult and the Mutation Function Context
impact: MEDIUM
impactDescription: clearer callback naming; mutation code can use context.client instead of a closure
tags: upgrade, v5, useMutation, onMutate, onMutateResult, context, mutationOptions
versions: v5
since: "5.89"
---

## Use onMutateResult and the Mutation Function Context

Since 5.89, `mutationFn` and every mutation callback get a trailing `context` argument: a `MutationFunctionContext` holding `client`, `mutationKey` and `meta`. The value returned from `onMutate` (formerly called "context") is now named `onMutateResult`, and the generic is `TOnMutateResult` (formerly `TContext`). Positions did not change, so old code still runs. Rename the third argument so it isn't confused with the new `context`, and use `context.client` in options defined outside components (e.g. with `mutationOptions`).

**Incorrect (pre-5.89 naming, closes over a client):**

```typescript
useMutation({
  mutationFn: addTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
});
```

**Correct (5.89+):**

```typescript
const addTodoOptions = () =>
  mutationOptions({
    mutationKey: ['addTodo'],
    mutationFn: addTodo,
    onMutate: async (newTodo, context) => {
      await context.client.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = context.client.getQueryData<Todo[]>(['todos']);
      return { previousTodos };
    },
    onError: (err, newTodo, onMutateResult, context) => {
      context.client.setQueryData(['todos'], onMutateResult?.previousTodos);
    },
    onSettled: (data, error, newTodo, onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['todos'] }),
  });

useMutation(addTodoOptions());
```

- Signatures: `mutationFn(variables, context)`, `onMutate(variables, context)`, `onSuccess(data, variables, onMutateResult, context)`, `onError(error, variables, onMutateResult | undefined, context)`, `onSettled(data, error, variables, onMutateResult | undefined, context)`.
- Since 5.90.2, `onMutateResult` is always defined in `onSuccess`.
- `mutationOptions` needs 5.82+.

Reference: [useMutation](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useMutation) · [MutationFunctionContext](https://tanstack.com/query/v5/docs/framework/react/reference/type-aliases/MutationFunctionContext)
