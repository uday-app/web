<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Repo Defaults

Apply these defaults for all substantial work in this repository:

- Read `docs/ai/stack-defaults.md` before changing architecture or data flow.
- Read `docs/ai/supabase-rpc-pattern.md` before creating or changing write paths.
- Read `docs/ai/heroui-guidelines.md` before building or redesigning UI.
- If repo-local skills are available, prefer `.codex/skills/web-repo-defaults/SKILL.md` for the durable stack defaults.

# Framework Rules

- This app uses Next.js 16 App Router.
- `cacheComponents` must stay enabled unless the user explicitly asks to remove it.
- Prefer Server Components by default.
- Read the relevant Next.js 16 docs before changing framework behavior, especially caching, routing, Server Actions, metadata, and file conventions.
- Do not copy generated Next.js type files out of `.next/types`.

# Data And Mutations

- Do not add TanStack Query, TanStack Table, TanStack Form, or similar client data orchestration libraries unless the user explicitly requests them.
- Prefer Server Actions for mutations and user-triggered writes.
- Prefer Supabase RPC from Server Actions for create, update, delete, and workflow operations.
- For RPC inputs and RPC responses, create Zod schemas and infer the related TypeScript types from those schemas.
- Keep secrets and database access on the server only.
- After mutations, revalidate with `revalidatePath()` or `revalidateTag()` as needed.

# UI Rules

- Use HeroUI v3 from `@heroui/react` for UI work when suitable.
- Use HeroUI v3 patterns only: no provider, semantic variants, compound components where supported, and `onPress` instead of `onClick` when supported.
- For component props and component-local shapes, prefer plain TypeScript types or interfaces unless runtime validation is explicitly needed.
- Keep the existing Tailwind v4 plus HeroUI CSS setup intact.

# Delivery Rules

- Reuse existing repo patterns before adding abstractions.
- When no pattern exists for a mutation flow, create it as Server Action -> Supabase RPC -> revalidation.
- Keep instructions and generated artifacts out of top-level `types/` unless they are hand-authored and intentionally maintained.
