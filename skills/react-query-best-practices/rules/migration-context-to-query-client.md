---
title: Custom context and contextSharing Replaced by a queryClient Argument
impact: LOW
impactDescription: breaking change for micro-frontends and apps with several QueryClients
tags: migration, v5, context, contextSharing, queryClient, micro-frontend
versions: v4, v5
---

## Custom context and contextSharing Replaced by a queryClient Argument

v5 removed the `context` option from hooks and the `contextSharing` prop from `QueryClientProvider`. For isolation, pass a specific `QueryClient` as the hook's second argument. To share a client across bundles or packages, pass the same client instance everywhere.

**v4 (before):**

```typescript
const customContext = React.createContext<QueryClient | undefined>(undefined);

useQuery({ queryKey: ['todos'], queryFn: fetchTodos, context: customContext });

<QueryClientProvider client={queryClient} contextSharing={true}>
  <App />
</QueryClientProvider>;
```

**v5 (after):**

```typescript
import { sharedQueryClient } from './query-client';

useQuery({ queryKey: ['todos'], queryFn: fetchTodos }, sharedQueryClient);
useMutation({ mutationFn: addTodo }, sharedQueryClient);

<QueryClientProvider client={sharedQueryClient}>
  <App />
</QueryClientProvider>;
```

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#removed-custom-context-prop-in-favor-of-custom-queryclient-instance)
