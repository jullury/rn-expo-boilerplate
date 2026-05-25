# P0 Boilerplate Completeness Design (Contracts-First)

Date: 2026-05-25
Status: Approved in chat (pending file review)

## Goal

Deliver P0 completeness for the boilerplate via strict contracts-first architecture:

- productized auth lifecycle
- pluggable productized observability
- enforced setup/runtime contracts
- stronger E2E/verification gates

## Architecture Boundaries

### 1) Auth Boundary

- Define `AuthProvider` contract for:
  - `signIn`
  - `signOut`
  - `refreshSession`
  - `restoreSession`
  - `getAccessToken`
- App/store/API layers call only this contract.

### 2) Observability Boundary

- Define `AnalyticsProvider` contract:
  - `identify`, `track`, `screen`, `reset`
- Define `CrashProvider` contract:
  - `captureException`, `captureMessage`, `setUser`, `setTag`
- Existing observability modules become adapters/facades over these contracts.

### 3) Setup/Runtime Boundary

- `pnpm run project:setup` generates provider/feature/env requirement metadata.
- Runtime validates generated contract + environment at boot.
- Invalid config enters safe degraded mode with structured diagnostics.

## Setup + Runtime Contracts

## Setup outputs (extended)

- selected provider metadata
- feature enablement metadata
- required env manifest per provider/feature
- dependency hints metadata
- schema/version metadata

## Runtime boot validation

1. Load generated contract artifacts
2. Validate required env keys
3. Validate selected provider readiness
4. Initialize provider or fall back safely

## Failure behavior

- Missing env keys: disable affected module, emit actionable warning, avoid crash loop
- Auth provider invalid: keep guarded routes behavior and mark session unavailable
- Observability invalid: use no-op providers

## Auth Productization Flow

1. `signIn(credentials)`
   - provider returns access/refresh/session payload
   - persist secure storage + auth store atomically
2. `restoreSession()` on boot
   - read secure storage
   - validate expiry/freshness
   - refresh if needed
3. `refreshSession()`
   - central refresh path with request coalescing
   - update storage + store
   - clear session on unrecoverable failure
4. `signOut()`
   - optional remote revoke
   - deterministic local clear

## API integration

- Request interceptor injects access token from auth provider
- Response interceptor handles 401:
  - one refresh path
  - retry original request once
  - then safe sign-out

## Auth error model

- `invalid_credentials`
- `session_expired`
- `network_unavailable`
- `provider_unconfigured`

## Observability Productization Flow

## Provider model

- pluggable analytics + crash providers
- no-op defaults always available

## Initialization policy

- valid contract/env → initialize selected providers
- invalid contract/env → initialize no-op providers + diagnostics

## Data hygiene defaults

- redact sensitive fields (tokens, sensitive headers, configured fields)
- enforce base event schema:
  - event name
  - timestamp
  - app version/build
  - platform
  - user/session identifiers when available

## Integration points

- Error boundary → crash provider
- API layer → analytics network events
- Auth lifecycle events:
  - sign_in_success/failure
  - session_restored
  - token_refresh_success/failure
  - sign_out

## E2E + Verification Gates

## E2E minimum coverage

1. Auth success path
2. Auth failure path
3. Session restore path
4. Offline auth behavior
5. Setup-generated feature behavior

## Per-step gate (required)

1. targeted tests
2. `pnpm typecheck`
3. `pnpm lint`
4. continue only on full success

## Wave-final gate

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- setup smoke (`pnpm run project:setup`)
- generated artifacts consistency check

## P0 Acceptance Criteria

P0 is complete only if:

1. Auth lifecycle fully productized with provider contract and typed errors
2. Observability productized with pluggable providers and no-op fallback
3. Setup/runtime contracts enforced and validated at bootstrap
4. E2E smoke suite covers auth/offline/session/setup behaviors
5. All quality gates pass

## Scope Discipline

- P0 only in this wave.
- P1/P2 addressed in later waves after P0 completion and verification.
