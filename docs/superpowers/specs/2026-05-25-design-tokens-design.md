# Neutral Design Tokens System Implementation Design

> **Context:** Expo SDK 56 React Native boilerplate with existing `Colors`, `Fonts`, `Spacing`, and `ThemedText`/`ThemedView` abstractions.

## Goal

Introduce a full, neutral, scalable design-token system (semantic + foundational tokens) for light/dark themes, typography, spacing, and shared UI primitives, while preserving current app behavior and enabling gradual migration.

## Scope

### In scope

- New token architecture (`primitives`, `semantic`, `fonts`, `index`)
- Typed hook to consume resolved theme tokens
- Migration of core base components:
  - `ThemedText`
  - `ThemedView`
- Incremental migration of a few key app surfaces to prove pattern
- Lint-clean result

### Out of scope

- Full visual redesign
- Brand-specific color identity
- Third-party design system library adoption (e.g., Tamagui/NativeWind)

## Chosen Approach (Option A)

Use a two-layer token model:

1. **Foundational primitives** for raw scales (spacing, radius, typography, elevation)
2. **Semantic tokens** for context-aware usage (`bg.canvas`, `text.primary`, etc.) with light/dark variants

This keeps component code expressive and resilient while preserving flexibility for future branding.

## Architecture

## 1) File Structure

```text
src/theme/
  primitives.ts      # spacing/radius/type/elevation scales
  fonts.ts           # cross-platform font family roles
  semantic.ts        # light/dark semantic color tokens
  index.ts           # typed exports and token bundle assembly

src/hooks/
  use-theme-tokens.ts # resolves color scheme + returns typed tokens
```

## 2) Token Model

### Primitives (theme-agnostic)

- `spacing`: `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`
- `radius`: `none, xs, sm, md, lg, xl, full`
- `type.size`: `xs, sm, md, lg, xl, 2xl, 3xl`
- `type.lineHeight`: matching readable defaults per size
- `type.weight`: `regular, medium, semibold, bold`
- `elevation`: `none, sm, md, lg`

### Semantic (theme-aware)

- `bg`: `canvas, surface, muted, inverse`
- `text`: `primary, secondary, tertiary, inverse, link`
- `border`: `default, subtle, strong`
- `icon`: `primary, secondary, inverse`
- `state`: `info, success, warning, danger`
- `focus`: `ring`

### Fonts

- role-based families: `sans`, `serif`, `mono`, `rounded`
- platform mapping via `Platform.select`

## 3) Access Pattern

`useThemeTokens()` returns:

- `themeName` (`light | dark`)
- `semantic`
- `primitives`
- `fonts`

This avoids direct imports of color maps in UI components and centralizes scheme resolution.

## Component Migration Design

## `ThemedText`

### Current issues

- Hardcoded font sizes, weights, and occasional hardcoded color value
- Variant semantics mixed with implementation values

### New behavior

- Token-backed type variants (`bodyMd`, `labelSm`, `titleLg`, `subtitle`, `codeSm`)
- Backward-compatible aliases for existing variant names (`default`, `small`, `smallBold`, etc.)
- `themeColor` evolves to semantic color key support

### Result

- No hardcoded typography or color constants in component
- Centralized control over text rhythm and scale

## `ThemedView`

### New behavior

- Accept semantic background keys (default `bg.canvas`)
- Map styles through tokens instead of direct `Colors` constant access

## Incremental App Adoption

Migrate a small proof set first:

- `src/app/_layout.tsx`
- `src/components/app-tabs.tsx` (and/or web variant)
- one screen component (`src/app/index.tsx` or `src/app/explore.tsx`)

This validates token ergonomics and catches typing gaps early.

## Error Handling and Edge Cases

- If scheme is `unspecified`, fallback to `light`
- Web hydration safety remains in `use-color-scheme.web.ts`
- Preserve sensible default token values for all semantic keys

## Testing and Verification

## Static checks

- `pnpm lint`
- `pnpm eslint --fix` (optional pass)

## Functional checks

- Verify both light and dark mode:
  - text contrast remains readable
  - surfaces and borders remain distinguishable
  - no regressions in base screens

## Regression checks

- Ensure old `ThemedText` variant usages still render (via alias map)

## Migration and Cleanup Plan

1. Add new token files and hook
2. Refactor `ThemedText` and `ThemedView` to consume tokens
3. Update representative app surfaces
4. Remove now-redundant fields from legacy `src/constants/theme.ts` or convert it into re-export layer
5. Confirm lint and runtime behavior

## Risks and Mitigations

- **Risk:** Variant rename breaks call sites
  - **Mitigation:** Keep alias compatibility and deprecate gradually
- **Risk:** Incomplete semantic mapping creates mixed styling
  - **Mitigation:** Enforce no direct hex usage outside token files
- **Risk:** Dark-mode contrast regressions
  - **Mitigation:** Explicit semantic contrast checks during verification

## Success Criteria

- Base theming uses token bundle, not ad-hoc constants
- `ThemedText` and `ThemedView` fully token-driven
- No hardcoded UI hex values outside token definitions
- Light/dark mode remains stable
- `pnpm lint` passes
