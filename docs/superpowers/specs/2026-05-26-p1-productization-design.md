# P1 Boilerplate Productization Design

Date: 2026-05-26
Status: Draft

## Goal

Deliver P1 productization across three dimensions:

1. **Provider starter modules** — turn stub adapters into usable SDK integrations
2. **Observability vendor wiring** — connect real Sentry (crash) and PostHog (analytics)
3. **Security hardening** — pre-commit hooks, runtime config validation, dependency policy

## Scope Discipline

- P1 only in this wave. P2 (CLI polish, health score, template presets) deferred.
- Each area must be independently verifiable (tests pass, typecheck, lint, CI green).
- Existing P0 contracts must remain backward-compatible.

---

## Area 1: Provider Starter Modules

### Motivation

The three provider adapters (`supabase`, `convex`, `firebase`) currently delegate to
`apiClient` (axios) with no SDK integration. Users have no example of how to use
the real provider SDKs. Starter modules give users working code they can extend.

### Design

Each provider gets a **starter module directory** under `src/lib/providers/<name>/`
that includes:

| Module      | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| `client.ts` | Provider SDK client initialization (reads env vars)     |
| `auth.ts`   | Auth adapter implementing `AuthProvider` contract       |
| `api.ts`    | Data adapter implementing `ApiProviderAdapter` contract |
| `index.ts`  | Barrel export                                           |

#### Supabase Starter (`src/lib/providers/supabase/`)

```ts
// client.ts — initializes supabase-js client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

```ts
// auth.ts — AuthProvider adapter for Supabase
import type { AuthProvider, AuthSession, SignInInput } from "@/lib/auth/types";
import { AuthError } from "@/lib/auth/errors";
import { supabase } from "./client";

export const supabaseAuthProvider: AuthProvider = {
  async signIn(input: SignInInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error || !data.session) {
      throw new AuthError(
        "invalid_credentials",
        error?.message ?? "Sign in failed",
      );
    }
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: { id: data.user.id, email: data.user.email },
    };
  },
  // ... signOut, refreshSession, restoreSession, getAccessToken
};
```

```ts
// api.ts — ApiProviderAdapter using supabase-js
export const supabaseApiAdapter: ApiProviderAdapter = {
  id: "supabase",
  async request(config) {
    // Use supabase-js REST client instead of raw axios
    const { data, error } = await supabase
      .from(config.url ?? "")
      .select(config.params?.select ?? "*");
    return error ? { ok: false, error } : { ok: true, data };
  },
};
```

**New env keys:**

| Key                             | Required for      |
| ------------------------------- | ----------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase provider |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase provider |

#### Convex Starter (`src/lib/providers/convex/`)

```ts
// client.ts
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
export const convexClient = new ConvexReactClient(convexUrl);
```

Convex uses React context for auth rather than a direct SDK auth call.
The auth adapter wraps `useAuth` from `convex/react`.

**New env keys:**

| Key                             | Required for                               |
| ------------------------------- | ------------------------------------------ |
| `EXPO_PUBLIC_CONVEX_URL`        | Convex provider                            |
| `EXPO_PUBLIC_CONVEX_DEPLOYMENT` | Convex provider (optional, for deployment) |

#### Firebase Starter (`src/lib/providers/firebase/`)

```ts
// client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  // ...
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**New env keys:**

| Key                                | Required for      |
| ---------------------------------- | ----------------- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`     | Firebase provider |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`  | Firebase provider |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase provider |

### Setup contract updates

- Add new env keys to `env-contract.ts`
- Update `output.mjs` env key maps
- Update `scripts/setup/run.mjs` env contract map

### Out of scope (deferred to P2)

- Provider-specific data query examples (CRUD screens)
- Provider-specific UI components
- Migration scripts between providers

---

## Area 2: Observability Vendor Wiring

### Motivation

The observability contracts exist with noop defaults. Users get no real crash
reporting or analytics out of the box. Wiring Sentry and PostHog (or equivalent)
makes the boilerplate genuinely production-ready.

### Design

#### Sentry Crash Provider (`src/lib/observability/providers/sentry/`)

```ts
// provider.ts
import * as Sentry from "@sentry/react-native";
import type { CrashProvider } from "@/lib/observability/providers/types";

export function createSentryCrashProvider(): CrashProvider {
  return {
    captureException(error, context) {
      Sentry.captureException(error, { extra: context });
    },
    captureMessage(message, context) {
      Sentry.captureMessage(message, { extra: context });
    },
    setUser(user) {
      Sentry.setUser(user ?? null);
    },
    setTag(key, value) {
      Sentry.setTag(key, value);
    },
  };
}
```

**Init in app bootstrap** (`app-providers.tsx` or root layout):

```ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
  enableNative: true,
});
```

**New env keys:**

| Key                      | Required for            |
| ------------------------ | ----------------------- |
| `EXPO_PUBLIC_SENTRY_DSN` | Error reporting feature |

#### PostHog Analytics Provider (`src/lib/observability/providers/posthog/`)

```ts
// provider.ts
import PostHog from "posthog-react-native";
import type { AnalyticsProvider } from "@/lib/observability/providers/types";

export function createPostHogAnalyticsProvider(): AnalyticsProvider {
  return {
    identify(userId, traits) {
      PostHog.identify(userId, traits);
    },
    track(name, payload) {
      PostHog.capture(name, payload);
    },
    screen(name, payload) {
      PostHog.screen(name, payload);
    },
    reset() {
      PostHog.reset();
    },
  };
}
```

**Init in app bootstrap:**

```ts
import PostHog from "posthog-react-native";

PostHog.init(process.env.EXPO_PUBLIC_POSTHOG_API_KEY!, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
});
```

**New env keys:**

| Key                           | Required for                                    |
| ----------------------------- | ----------------------------------------------- |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | Analytics feature                               |
| `EXPO_PUBLIC_POSTHOG_HOST`    | Analytics feature (optional, defaults to cloud) |

### Provider selection logic

In `app-providers.tsx`, at boot:

```ts
import { createSentryCrashProvider } from "@/lib/observability/providers/sentry/provider";
import { createPostHogAnalyticsProvider } from "@/lib/observability/providers/posthog/provider";
import { setObservabilityProviders } from "@/lib/observability/providers/registry";

// When runtime validation passes and errorReporting is enabled:
setObservabilityProviders({
  crash: createSentryCrashProvider(),
  analytics: createPostHogAnalyticsProvider(),
});
```

This mirrors the existing setup-store/registry pattern — if env is missing,
noop providers are used.

### Setup contract updates

- Add `EXPO_PUBLIC_SENTRY_DSN` under `errorReporting` feature
- Add `EXPO_PUBLIC_POSTHOG_API_KEY`, `EXPO_PUBLIC_POSTHOG_HOST` under `analytics` feature
- Update `env-contract.ts`, `output.mjs`, `run.mjs`

### Dependency updates

```json
{
  "dependencies": {
    "@sentry/react-native": "^6.0.0",
    "posthog-react-native": "^3.0.0"
  }
}
```

### Out of scope (deferred to P2)

- Source map upload pipeline for Sentry
- EAS build plugin for Sentry
- PostHog feature flags integration
- Custom event schema validation at provider boundary

---

## Area 3: Security Hardening

### Motivation

The boilerplate has Gitleaks and dependency audit in CI, but lacks:

- Local pre-commit secret scanning (catches secrets before they reach CI)
- Runtime configuration validation at boot
- Dependency vulnerability gating with fail-on policy
- Automated security headers in API client

### Design

#### Pre-commit hook — Gitleaks via Lefthook

Current `lefthook.yml` has `commit-msg` (commitlint) and `pre-commit` (lint-staged).
Add a `pre-commit` hook that runs Gitleaks:

```yaml
pre-commit:
  parallel: true
  commands:
    lint-staged:
      run: ...
    gitleaks:
      run: gitleaks git --pre-commit --verbose
```

This gives local feedback before CI rejects the commit.

#### Pre-commit hook — dependency audit (fast check)

```yaml
    dep-audit:
      run: pnpm audit --audit-level high --json || echo "WARNING: vulnerabilities found"
```

Note: make this a warning, not a blocker, to avoid frustrating development velocity.

#### Runtime config validation

Extend the existing `validateRuntimeSetup` to also validate config shape:

```ts
// src/lib/setup/runtime-validation.ts — extended
export function validateRuntimeSetup(
  contract: RuntimeSetupContract,
  env: Record<string, string | undefined>,
): RuntimeSetupValidationResult {
  const missingKeys = contract.requiredKeys.filter((key) => {
    const value = env[key];
    return value === undefined || value.trim().length === 0;
  });

  const warnings: string[] = [];
  // Add config warnings (e.g. running with demo config in production)
  if (env.EXPO_PUBLIC_APP_ENV === "production") {
    if (missingKeys.length > 0) {
      warnings.push("Production mode with missing required env vars");
    }
  }

  return {
    valid: missingKeys.length === 0,
    missingKeys,
    warnings,
  };
}
```

This feeds into the existing `useSetupStore` and can be shown in a dev-only
warning banner during development.

#### Dependency gate policy

Upgrade the CI `dependency-audit` job to fail on high+ severity:

```yaml
- name: Dependency audit
  run: pnpm audit --audit-level high
```

This already exists in the security workflow. Add a `--fail-on` flag for
explicit policy, and add an allowlist mechanism for known false positives:

```yaml
- name: Dependency audit
  run: |
    pnpm audit --audit-level high --json > audit-report.json || true
    node scripts/ci/check-audit.mjs audit-report.json
```

Where `scripts/ci/check-audit.mjs` filters known-ignored advisories and fails
only on new/unknown vulnerabilities.

#### API security headers

Add a default security headers configuration to the API client:

```ts
// src/lib/api/client.ts — extended
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

apiClient.defaults.headers.common = {
  ...apiClient.defaults.headers.common,
  ...securityHeaders,
};
```

### Out of scope (deferred to P2)

- CSP header configuration for web
- Certificate pinning for mobile
- Runtime secret rotation
- Security scoring / SBOM generation

---

## P1 Acceptance Criteria

P1 is complete only if:

1. **Supabase starter module**: env keys, auth adapter, API adapter, tests, committed
2. **Convex starter module**: env keys, auth adapter, API adapter, tests, committed
3. **Firebase starter module**: env keys, auth adapter, API adapter, tests, committed
4. **Sentry crash provider**: provider, init wiring, env keys, tests, committed
5. **PostHog analytics provider**: provider, init wiring, env keys, tests, committed
6. **Env contract updated**: new keys reflected in buildEnvContract, output.mjs, run.mjs
7. **Pre-commit Gitleaks**: lefthook runs gitleaks on pre-commit
8. **Runtime config validation extended**: warnings field added, production-mode detection
9. **API security headers**: default headers added to axios client
10. **Dependency audit gate**: allowlist mechanism, explicit fail policy
11. **All quality gates pass**: test, typecheck, lint, CI

## Sequence

```
Wave 1: Provider starter modules (Supabase → Convex → Firebase)
Wave 2: Observability vendor wiring (Sentry → PostHog)
Wave 3: Security hardening (gitleaks hook → config validation → dep gate → headers)
```

## Backward Compatibility

- All existing P0 contracts unchanged.
- New provider modules live in `src/lib/providers/<name>/`, separate from existing stubs.
- Existing `src/lib/api/providers/<name>/adapter.ts` stubs remain as fallback.
- Observability wiring is opt-in via env keys; missing keys = noop fallback (existing behavior).
- Security hardening is additive; no existing behavior changes.
