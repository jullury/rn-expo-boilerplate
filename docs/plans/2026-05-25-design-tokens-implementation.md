# Neutral Design Tokens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace ad-hoc theme constants with a neutral, scalable design-token system (semantic + primitives) and migrate base themed components to use it.

**Architecture:** Add a new `src/theme` module with primitives, semantic light/dark palettes, and font roles. Expose typed token access through `use-theme-tokens`, then migrate `ThemedText` and `ThemedView` to consume tokens first, followed by representative app surfaces. Keep compatibility aliases for existing text variants to avoid broad breakage.

**Tech Stack:** Expo SDK 56, React Native, TypeScript, expo-router, ESLint 9, Prettier

---

### Task 1: Add foundational token files

**Files:**

- Create: `src/theme/primitives.ts`
- Create: `src/theme/fonts.ts`
- Create: `src/theme/semantic.ts`
- Create: `src/theme/index.ts`

**Step 1: Write the failing type check expectation**

Expected imports should work (currently fail because files do not exist):

```ts
import { primitives, fonts, semantic, type ThemeName } from "@/theme";
```

**Step 2: Run lint to verify pre-change baseline**

Run: `pnpm lint`
Expected: PASS (baseline before token module creation)

**Step 3: Write minimal implementation**

Implement exact exports:

- `primitives.ts`
  - `spacing` scale with keys: `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`
  - `radius` scale: `none, xs, sm, md, lg, xl, full`
  - `typography` object containing `size`, `lineHeight`, `weight`
  - `elevation` object with `none, sm, md, lg`

- `fonts.ts`
  - platform roles: `sans`, `serif`, `mono`, `rounded` via `Platform.select`

- `semantic.ts`
  - `semantic.light` and `semantic.dark` with groups:
    - `bg: canvas, surface, muted, inverse`
    - `text: primary, secondary, tertiary, inverse, link`
    - `border: default, subtle, strong`
    - `icon: primary, secondary, inverse`
    - `state: info, success, warning, danger`
    - `focus: ring`

- `index.ts`
  - exports `primitives`, `fonts`, `semantic`
  - type aliases: `ThemeName = 'light' | 'dark'`, `ThemeSemantic`, `ThemeTokens`

**Step 4: Run lint to verify it passes**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/theme/primitives.ts src/theme/fonts.ts src/theme/semantic.ts src/theme/index.ts
git commit -m "feat(theme): add foundational and semantic design tokens"
```

### Task 2: Add typed token hook

**Files:**

- Create: `src/hooks/use-theme-tokens.ts`
- Modify: `src/hooks/use-theme.ts`

**Step 1: Write the failing test/check**

Expected new hook API (currently unavailable):

```ts
const { themeName, semantic, primitives, fonts } = useThemeTokens();
```

**Step 2: Run lint to verify expected failure context**

Run: `pnpm lint`
Expected: PASS before introducing references

**Step 3: Write minimal implementation**

- In `use-theme-tokens.ts`:
  - use `useColorScheme` from `@/hooks/use-color-scheme`
  - coerce `unspecified` to `light`
  - return `{ themeName, semantic: semantic[themeName], primitives, fonts }`

- In `use-theme.ts`:
  - keep backward compatibility by mapping old return shape to semantic tokens:
    - `text -> semantic.text.primary`
    - `background -> semantic.bg.canvas`
    - `backgroundElement -> semantic.bg.surface`
    - `backgroundSelected -> semantic.bg.muted`
    - `textSecondary -> semantic.text.secondary`

**Step 4: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/use-theme-tokens.ts src/hooks/use-theme.ts
git commit -m "feat(theme): add typed theme token hook and compatibility mapping"
```

### Task 3: Migrate ThemedText to token-driven typography

**Files:**

- Modify: `src/components/themed-text.tsx`

**Step 1: Write the failing check**

Define expected support for semantic text role + compatibility aliases:

- Existing: `default`, `title`, `small`, `smallBold`, `subtitle`, `link`, `linkPrimary`, `code`
- New internal mapping to token-backed styles

**Step 2: Run lint**

Run: `pnpm lint`
Expected: PASS (baseline)

**Step 3: Write minimal implementation**

- Replace hardcoded values with token references from `useThemeTokens`
- Keep public prop `type` unchanged for compatibility
- Keep `themeColor` support (old keys) and add semantic fallback logic
- Remove hardcoded `#3c87f7` and use `semantic.text.link`
- Use tokenized `fonts.mono` for `code`

**Step 4: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/themed-text.tsx
git commit -m "refactor(theme): migrate ThemedText to design tokens"
```

### Task 4: Migrate ThemedView to semantic background tokens

**Files:**

- Modify: `src/components/themed-view.tsx`

**Step 1: Write failing check**

Expected ability to resolve default semantic background (`bg.canvas`) and mapped compatibility behavior for current props.

**Step 2: Run lint baseline**

Run: `pnpm lint`
Expected: PASS

**Step 3: Write minimal implementation**

- Read semantic tokens via `useThemeTokens`
- Map legacy `themeColor` keys to semantic equivalents
- Keep same public API while ensuring no direct hex usage

**Step 4: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/themed-view.tsx
git commit -m "refactor(theme): migrate ThemedView to semantic tokens"
```

### Task 5: Apply tokens to representative app surfaces

**Files:**

- Modify: `src/components/app-tabs.tsx`
- Modify: `src/components/app-tabs.web.tsx`
- Modify: `src/app/index.tsx`
- Modify: `src/app/explore.tsx`

**Step 1: Identify hardcoded style values**

Search for direct color/spacing literals in target files and mark replacements.

**Step 2: Run lint baseline**

Run: `pnpm lint`
Expected: PASS

**Step 3: Write minimal implementation**

- Replace hardcoded colors with semantic tokens
- Replace common spacing literals with `primitives.spacing` where reasonable
- Avoid broad unrelated refactors

**Step 4: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/app-tabs.tsx src/components/app-tabs.web.tsx src/app/index.tsx src/app/explore.tsx
git commit -m "refactor(theme): apply design tokens to core app surfaces"
```

### Task 6: Cleanup and verification

**Files:**

- Modify: `src/constants/theme.ts`

**Step 1: Write failing check**

Confirm that tokenized components no longer require old direct constants beyond compatibility layer.

**Step 2: Run lint baseline**

Run: `pnpm lint`
Expected: PASS

**Step 3: Write minimal cleanup implementation**

- Convert `src/constants/theme.ts` into:
  - thin compatibility re-exports from `src/theme`
  - or remove unused constants while preserving imports that still exist
- Ensure no duplicate source-of-truth for spacing/fonts/colors remains

**Step 4: Run full verification**

Run commands in order:

1. `pnpm lint`
2. `pnpm format`
3. `pnpm lint`

Expected: all commands PASS

**Step 5: Commit**

```bash
git add src/constants/theme.ts src/theme src/hooks/use-theme-tokens.ts src/hooks/use-theme.ts src/components/themed-text.tsx src/components/themed-view.tsx src/components/app-tabs.tsx src/components/app-tabs.web.tsx src/app/index.tsx src/app/explore.tsx
git commit -m "refactor(theme): finalize neutral design token system"
```

### Task 7: Final manual QA checklist

**Files:**

- No code changes required (unless bugs found)

**Step 1: Run app**

Run: `pnpm start`
Expected: Expo dev server starts

**Step 2: Check light and dark mode**

Verify on iOS/Android/web:

- readable text contrast
- surfaces visually distinct
- code text uses mono family

**Step 3: If regressions found, patch minimally**

Apply smallest possible fixes in token files or component mappings.

**Step 4: Re-run lint**

Run: `pnpm lint`
Expected: PASS

**Step 5: Commit QA fixes (if any)**

```bash
git add <only-regression-fix-files>
git commit -m "fix(theme): adjust token mappings after qa"
```
