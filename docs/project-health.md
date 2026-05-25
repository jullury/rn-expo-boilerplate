# Project Health — rn-expo-boilerplate

Last updated: 2026-05-26

## Summary

Production-oriented Expo SDK 56 boilerplate with contracts-first provider
abstraction, setup-driven feature selection, auth lifecycle enforcement,
observability with safe degradation, and CI/CD automation.

## Status Matrix

| Area                                            | Status         | Notes                                                                          |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------------------------ |
| App routing architecture                        | ✅ Implemented | Public/protected route groups and auth gate present                            |
| Global state                                    | ✅ Implemented | `useAuthStore` + `useAppStore` + `useSetupStore` via Zustand                   |
| API client + error normalization                | ✅ Implemented | `src/lib/api/client.ts`, `errors.ts`                                           |
| API auth token injection + 401 retry            | ✅ Implemented | Request interceptor + `handle401Retry` with refresh coalescing                 |
| Provider adapter contract                       | ✅ Implemented | `ApiProviderAdapter` with supabase/convex/firebase/custom shells               |
| Secure/local persistence                        | ✅ Implemented | SecureStore + local storage wrappers                                           |
| Query/data foundation                           | ✅ Implemented | React Query client/provider wired                                              |
| Unit test baseline                              | ✅ Implemented | Jest configured; tests passing                                                 |
| CI verification                                 | ✅ Implemented | Lint/typecheck/test on `main` and `develop`                                    |
| Maestro flow validation in CI                   | ✅ Implemented | Syntax validation via `--dry-run` on auth + navigation flows                   |
| EAS build config                                | ✅ Implemented | Preview + production profiles                                                  |
| semantic-release automation                     | ✅ Implemented | Stable on `main`, beta on `develop`                                            |
| Setup wizard (`pnpm run project:setup`)         | ✅ Implemented | Provider + feature selection with diff summary and env warnings                |
| Setup managed feature pruning                   | ✅ Implemented | Disabled managed features physically removed from generated dirs               |
| Setup CLI diff summary + env warnings           | ✅ Implemented | Shows config changes and required env vars after setup                         |
| Setup env contract generation                   | ✅ Implemented | `buildEnvContract()` produces `requiredKeys` for selected config               |
| Runtime env validation                          | ✅ Implemented | `validateRuntimeSetup()` at app boot, result stored in `useSetupStore`         |
| Safe degradation                                | ✅ Implemented | Noop fallback for observability when env is invalid                            |
| Auth provider contract + lifecycle              | ✅ Implemented | `AuthProvider` with signIn/signOut/refreshSession/restoreSession               |
| Auth error types                                | ✅ Implemented | `AuthError` with typed codes + `AuthErrorCode` union                           |
| Auth runtime injection                          | ✅ Implemented | `getRuntimeAuthProvider()` / `setRuntimeAuthProvider()` for DI                 |
| Auth lifecycle analytics events                 | ✅ Implemented | `auth.sign_in_success`, `auth.sign_out`, `auth.token_refresh_success`          |
| Observability provider contract                 | ✅ Implemented | `AnalyticsProvider` + `CrashProvider` typed interfaces                         |
| Observability provider registry + noop fallback | ✅ Implemented | Falls back to noop when runtime validation fails                               |
| Payload redaction                               | ✅ Implemented | Sensitive fields redacted from logged payloads                                 |
| i18n core                                       | ✅ Implemented | i18next + expo-localization, EN/FR resources                                   |
| User-facing text localization                   | ✅ Implemented | Core screens/components localized                                              |
| Locale formatting helpers                       | ✅ Implemented | Date/number/currency helpers added                                             |
| Network awareness UX                            | ✅ Implemented | Offline banner + network subscription                                          |
| E2E smoke flows (Maestro)                       | ✅ Implemented | Auth success + tab navigation flows (CI dry-run, local full-run)               |
| Notifications bootstrap                         | 🟡 Scaffolded  | Permission + token bootstrapping present                                       |
| Media/camera permissions                        | 🟡 Scaffolded  | Wrapper helpers added                                                          |
| Haptics integration                             | 🟡 Scaffolded  | Wrapper helpers added                                                          |
| Analytics vendor integration                    | ✅ Implemented | PostHog provider added and setup-gated boot wiring in app providers            |
| Crash vendor integration                        | ✅ Implemented | Sentry crash provider added and setup-gated boot wiring in app providers       |
| Full UI design system                           | 🟡 Partially   | Button/Input/Modal/Toast/BottomSheet present; more primitives needed           |
| Provider starter modules                        | ✅ Implemented | Supabase/Convex/Firebase starter modules with auth + API helpers + tests       |
| Security hardening                              | ✅ Implemented | Pre-commit hooks, runtime production warnings, audit allowlist CI, API headers |
| CLI UX polish                                   | ⏳ Pending     | Non-interactive flags, `--dry-run`, JSON output mode                           |
| Boilerplate health score                        | ⏳ Pending     | Self-diagnostic CLI + health badge                                             |

## Risks / Gaps

1. **Auth is demo-only**: Sign-in uses hardcoded demo tokens; no real API integration.
2. **Observability startup config sensitivity**: Vendor boot depends on setup flags and required env keys.
3. **Notification flow incomplete**: No backend token registration lifecycle yet.
4. **UI kit incomplete**: Some primitives present but not comprehensive.
5. **Generated/manual boundary discipline**: Manual edits must stay out of setup-owned generated paths.

## Recommended Next Milestones

### Milestone A — P1: Provider starter modules + security hardening (Complete)

- Supabase/Convex/Firebase starter modules implemented (auth + API helper examples)
- Runtime config validation expanded with production warnings
- Pre-commit secret check hook (gitleaks) added
- Dependency audit policy gating added (local warning + CI allowlist enforcement)

### Milestone B — P2: CLI UX polish + health checks

- Non-interactive flags (`--provider`, `--features`, `--yes`)
- `--dry-run` mode (show what would change without writing)
- JSON output mode for CI integration
- Optional module packs / template presets
- Boilerplate health self-diagnostic script + score

### Milestone C — Real provider wiring

- Wire analytics provider (PostHog or Amplitude)
- Wire crash reporting provider (Sentry)
- Auth backend integration (real sign-in/refresh/logout APIs)

### Milestone D — UX completion

- Comprehensive UI design system (data-table, picker, avatar, chip)
- Notification delivery lifecycle
- Permission education screens + denial recovery
