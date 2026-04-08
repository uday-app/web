# HeroUI Guidelines

Use HeroUI v3 for UI work in this repository.

## Rules

- Import components from `@heroui/react`.
- Do not add a `HeroUIProvider`.
- Prefer semantic variants such as `primary`, `secondary`, `tertiary`, `danger`, `ghost`, and `outline`.
- Use compound component APIs when the component supports them.
- Prefer `onPress` over `onClick` when the component exposes it.
- Keep the existing Tailwind + HeroUI CSS import order in `app/globals.css`.

## Repo Notes

- HeroUI styles are already imported globally.
- Keep designs compatible with desktop and mobile layouts.
- Prefer building UI primitives from HeroUI before introducing custom interaction widgets.
