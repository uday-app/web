# Web App Stack Defaults

This repository uses the Next.js App Router on Next.js 16.

## Core Defaults

- Read the relevant Next.js 16 doc in `node_modules/next/dist/docs/` before changing framework behavior.
- Prefer Server Components by default.
- Use Server Actions for writes and user-triggered mutations.
- Keep secrets and database access on the server.

## Caching

- `cacheComponents` is enabled in `next.config.ts`.
- Treat runtime-fresh data as the default.
- Only cache intentionally with `"use cache"`, `cacheLife()`, and `cacheTag()`.
- After mutations, revalidate with `revalidatePath()` or `revalidateTag()` as needed.

## Data Layer

- Do not add TanStack Query, TanStack Table, TanStack Form, or similar client data layers unless explicitly requested.
- Do not introduce generic REST wrappers if the feature already fits Supabase RPC.
- Prefer typed server-side helpers over client-side fetch orchestration.

## Supabase Pattern

- Default mutation path: UI -> Server Action -> Supabase RPC -> revalidation -> updated UI.
- Prefer calling Postgres logic through Supabase RPC from Server Actions for create, update, delete, and workflow actions.
- If a feature needs a new mutation and no existing pattern is present, create the mutation as a Server Action first.

## UI Layer

- Use HeroUI v3 components from `@heroui/react` when building or refreshing UI.
- Follow HeroUI v3 patterns only: no provider, compound components where applicable, semantic variants, and `onPress` instead of `onClick` when supported.
- Keep Tailwind v4 and HeroUI styles aligned with existing app styling.

## Generated Files

- Do not copy generated Next.js types out of `.next/types`.
- Do not commit duplicate route/type validator files into a top-level `types/` directory.
