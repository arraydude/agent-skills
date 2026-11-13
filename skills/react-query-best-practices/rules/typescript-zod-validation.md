---
title: Validate API Responses at Runtime with Zod
impact: HIGH
impactDescription: catches API contract violations; the parse error becomes the query error
tags: typescript, zod, validation, runtime
versions: v4, v5
---

## Validate API Responses at Runtime with Zod

Parse the response inside the `queryFn` instead of asserting a type. The schema is then the single source of truth for the `queryFn`'s return type, so `data` stays inferred. A failed parse throws, and the query goes to its error state like any other rejected `queryFn`.

**Incorrect (type assertion, unchecked at runtime):**

```typescript
async function fetchTodos() {
  const response = await fetch('/api/todos');
  return (await response.json()) as Todo[]; // trusts the server blindly
}
```

**Correct (schema-validated):**

```typescript
import { z } from 'zod';

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
});
const todosSchema = z.array(todoSchema);
type Todo = z.infer<typeof todoSchema>;

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return todosSchema.parse(await response.json()); // throws on mismatch
}

const { data, error } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
// data: Todo[] | undefined
```

- The TanStack docs ask only for a `queryFn` with a well-defined return type and do not prescribe a validation library. Any parser that throws on a mismatch works the same way.
- Validation errors are retried like network errors (3 times by default). If a contract mismatch should fail fast, set `retry` for that query.

Reference: [TypeScript](https://tanstack.com/query/v5/docs/framework/react/typescript) · [v4 TypeScript](https://tanstack.com/query/v4/docs/framework/react/typescript)
