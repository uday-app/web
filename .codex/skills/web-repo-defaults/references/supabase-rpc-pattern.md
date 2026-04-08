# Supabase RPC Pattern

Preferred mutation flow:

1. Client interaction submits to a Server Action.
2. Server Action validates input.
3. Server Action calls Supabase RPC.
4. Server Action revalidates affected UI.
5. UI renders fresh server data.

## Rules

- Keep RPC calls on the server.
- Define Zod schemas for RPC inputs and RPC responses.
- Infer TypeScript types from those schemas.
- Prefer small typed action return values.
- Do not move write logic into client components.
- Prefer plain TypeScript types or interfaces for component props unless runtime validation is needed.
