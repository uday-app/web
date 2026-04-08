---
name: web-repo-defaults
description: Apply this repository's default engineering rules when working in the web app: Next.js 16 docs first, cacheComponents enabled, no TanStack libraries by default, prefer Server Actions with Supabase RPC for mutations, and use HeroUI v3 for UI work.
---

# Web Repo Defaults

Use this skill for any substantial work in this repository.

## Apply These Defaults

- Read [stack-defaults](references/stack-defaults.md) before architecture changes.
- Read [supabase-rpc-pattern](references/supabase-rpc-pattern.md) before creating or changing writes, forms, or workflow actions.
- Read [heroui-guidelines](references/heroui-guidelines.md) before building or redesigning UI.

## Non-Negotiables

- Read the relevant Next.js 16 docs in `node_modules/next/dist/docs/` before changing framework behavior.
- Keep `cacheComponents` enabled unless the user explicitly asks to remove it.
- Do not introduce TanStack Query, Table, Form, Router, or similar client orchestration libraries unless the user explicitly asks for them.
- Prefer Server Actions for mutations.
- Prefer Supabase RPC from Server Actions for business operations.
- For RPC inputs and responses, define Zod schemas and infer TypeScript types from them.
- Use HeroUI v3 patterns only.
- Do not duplicate generated Next.js type files outside `.next/types`.

## Implementation Defaults

- Default to Server Components.
- Keep secrets and database access on the server.
- Revalidate cache after mutations with `revalidatePath()` or `revalidateTag()`.
- Prefer plain TypeScript types or interfaces for component props unless runtime validation is needed.
- Reuse existing patterns before introducing a new abstraction.
