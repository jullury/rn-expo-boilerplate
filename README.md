# rn-expo-boilerplate

Expo SDK 56 boilerplate with production foundations:

- Expo Router + route groups
- Protected routing scaffold
- Query client (`@tanstack/react-query`)
- API layer (`axios`) + normalized error mapping
- Auth/session store (`zustand`) + secure token storage
- Jest + React Native Testing Library baseline
- CI workflow (`lint`, `typecheck`, `test`)
- EAS build profiles (`preview`, `production`)

## Requirements

- Node 22+
- pnpm 10+

## Setup

```bash
pnpm install
pnpm start
```

## Scripts

- `pnpm start` - start Expo dev server
- `pnpm ios` - open iOS simulator
- `pnpm android` - open Android emulator
- `pnpm web` - run web target
- `pnpm lint` - run Expo ESLint config
- `pnpm typecheck` - run TypeScript checks
- `pnpm test` - run Jest tests

## Environment

Set public API URL for the shared API client:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com
```

The value is read in `src/lib/api/client.ts`.

## Project layout (current)

- `src/app/(public)` - public routes (e.g. sign-in)
- `src/app/(protected)` - guarded app routes
- `src/lib/api` - API client + error utilities
- `src/lib/query` - shared query client
- `src/lib/storage` - secure/local storage wrappers
- `src/lib/platform` - network/notifications/haptics/media wrappers
- `src/lib/observability` - logging, analytics, crash reporting abstractions
- `src/lib/i18n` - localization, formatting, locale settings
- `src/providers` - app-level providers
- `src/store` - global state stores

## Implementation status

### ✅ Implemented

- Core architecture
  - Query client and provider
  - API client + normalized error mapping
  - Auth store + secure token persistence
  - App store for network state
- Routing and auth scaffolding
  - Public/protected route groups
  - Sign-in gate and guarded protected layout
- Developer experience
  - Lint + typecheck + test scripts
  - Jest baseline with module aliasing
  - CI workflow on `main` + `develop`
  - EAS config (`preview` + `production`)
- Release automation
  - semantic-release on `main` (stable)
  - semantic-release on `develop` (beta prereleases)
  - changelog generation and GitHub release publishing
- Observability
  - App error boundary
  - Analytics and crash-reporting abstraction layers
- Localization
  - i18next + react-i18next + expo-localization
  - EN/FR resources
  - Locale date/number/currency formatting helpers
  - No hardcoded user-facing UI copy in core screens/components
- Platform capability scaffolds
  - Network subscription + offline banner
  - Notification permission + token bootstrap
  - Camera/media permissions helpers
  - Haptics wrappers

### 🟡 Partially implemented (scaffolded, not fully productized)

- Notification delivery lifecycle (token sync backend, topic segmentation)
- Permissions UX (pre-permission education screens, denial recovery flows)
- Auth backend integration (real API login/refresh/logout)
- Analytics vendor integration (currently abstraction + logs)
- Crash reporting vendor integration (currently abstraction + logs)

### ⏳ Still pending (recommended next)

- Full design system primitives (modal, toast, bottom sheet, empty/error states)
- E2E tests (Detox or Maestro)
- Remote feature flags
- API retry/backoff/circuit breaker strategy
- Security hardening pass (secret scanning + stricter headers/config)
- Production runbooks and incident docs

See `docs/project-health.md` for a fuller status matrix.

## EAS

`eas.json` includes:

- `preview` (internal distribution)
- `production` (auto increment enabled)

## Automated releases (semantic-release)

This repo uses `semantic-release` with conventional commits.

- `main` branch publishes stable releases
- `develop` branch publishes prereleases on the `beta` channel

Release automation files:

- `.releaserc.json`
- `.github/workflows/release.yml`
- `CHANGELOG.md`

To trigger a release, merge commit(s) with conventional commit messages
(`feat:`, `fix:`, etc.) into `main` or `develop`.
