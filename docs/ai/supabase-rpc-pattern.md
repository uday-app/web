# Server Actions + Supabase RPC Pattern

Use this pattern by default for data mutations in this repository.

## Workflow

1. Accept input in a Server Action.
2. Validate and normalize input on the server.
3. Call a Supabase RPC function from the server.
4. Return a small typed result.
5. Revalidate the affected route or cache tag.

## Rules

- Do not put write logic directly in client components.
- Do not expose service-role secrets to the client.
- Define Zod schemas for RPC inputs and RPC response payloads.
- Infer the related TypeScript types from those Zod schemas instead of duplicating the shapes manually.
- Keep action return shapes small and predictable.
- Prefer one clear RPC per business operation over multiple client-orchestrated calls.
- When updating data, include cache invalidation in the same Server Action.

## Default Shape

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateThingInputSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

const updateThingResultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true) }),
  z.object({ ok: z.literal(false), message: z.string() }),
]);

type UpdateThingInput = z.infer<typeof updateThingInputSchema>;
type UpdateThingResult = z.infer<typeof updateThingResultSchema>;

export async function updateThingAction(
  input: UpdateThingInput,
): Promise<UpdateThingResult> {
  const parsedInput = updateThingInputSchema.parse(input);

  // Call Supabase RPC here

  revalidatePath("/things");
  return { ok: true };
}
```

## When Not To Use RPC

- Purely local UI state changes.
- Simple read-only rendering that already fits server-side querying without a mutation flow.
- Cases where the user explicitly asks for a different integration style.

## Typing Rule

- Use Zod as the source of truth for RPC contracts.
- Use plain TypeScript types or interfaces for component props unless runtime validation is required.
