# Project Health — rn-expo-boilerplate

Last updated: 2026-05-25

## Summary

This boilerplate now includes a production-oriented foundation across routing,
state, API abstraction, i18n, observability, CI/release automation, and core
platform capability wrappers.

## Status Matrix

| Area                               | Status         | Notes                                                 |
| ---------------------------------- | -------------- | ----------------------------------------------------- |
| App routing architecture           | ✅ Implemented | Public/protected route groups and auth gate present   |
| Global state                       | ✅ Implemented | `useAuthStore` + `useAppStore` via Zustand            |
| API client and error normalization | ✅ Implemented | `src/lib/api/client.ts`, `errors.ts`                  |
| Secure/local persistence           | ✅ Implemented | SecureStore + local storage wrappers                  |
| Query/data foundation              | ✅ Implemented | React Query client/provider wired                     |
| Unit test baseline                 | ✅ Implemented | Jest configured; tests passing                        |
| CI verification                    | ✅ Implemented | Lint/typecheck/test on `main` and `develop`           |
| EAS build config                   | ✅ Implemented | Preview + production profiles                         |
| semantic-release automation        | ✅ Implemented | Stable on `main`, beta on `develop`                   |
| Setup wizard (`pnpm setup`)        | ✅ Implemented | Provider + feature selection with safe reconfigure    |
| Setup managed feature pruning      | ✅ Implemented | Disabled managed features removed from generated dirs |
| i18n core                          | ✅ Implemented | i18next + expo-localization, EN/FR resources          |
| User-facing text localization      | ✅ Implemented | Core screens/components localized                     |
| Locale formatting helpers          | ✅ Implemented | Date/number/currency helpers added                    |
| Network awareness UX               | ✅ Implemented | Offline banner + network subscription                 |
| Notifications bootstrap            | 🟡 Scaffolded  | Permission + token bootstrapping present              |
| Media/camera permissions           | 🟡 Scaffolded  | Wrapper helpers added                                 |
| Haptics integration                | 🟡 Scaffolded  | Wrapper helpers added                                 |
| Analytics vendor integration       | ⏳ Pending     | Abstraction exists; backend vendor not wired          |
| Crash vendor integration           | ⏳ Pending     | Abstraction exists; backend vendor not wired          |
| Full UI design system              | ⏳ Pending     | Button/Input present; modal/toast/sheets pending      |
| E2E test suite                     | ⏳ Pending     | No Detox/Maestro flow yet                             |

## Risks / Gaps

1. **Auth is demo-only**: sign-in currently sets local demo tokens.
2. **Observability is abstraction-only**: needs real providers (e.g. Sentry/PostHog).
3. **Notification flow incomplete**: no backend token registration lifecycle yet.
4. **UI kit incomplete**: only initial primitives are present.
5. **Generated/manual boundary discipline**: manual edits must stay out of setup-owned generated paths.

## Recommended Next Milestones

### Milestone A — Productize auth and API integration

- Add real auth endpoints and token refresh flow
- Add protected fetch helpers and retry policy

### Milestone B — Productize observability

- Wire analytics provider
- Wire crash provider and source-map pipeline

### Milestone C — Expand UI system and test depth

- Add modal/toast/sheet primitives and empty/error states
- Add E2E smoke flows (auth gate + offline + navigation)
