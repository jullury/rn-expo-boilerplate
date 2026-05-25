# P1 Boilerplate Productization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver P1 productization across provider starter modules, observability vendor wiring, and security hardening.

**Architecture:** Extend existing P0 contracts with real SDK integrations and security enforcement. All P0 contracts remain backward-compatible.

**Tech Stack:** TypeScript, Expo SDK 56, Zustand, zod, Jest, Maestro, Lefthook, Gitleaks

**Sequence:** Wave 1 (providers) → Wave 2 (observability) → Wave 3 (security)

---

## Wave 1 — Provider Starter Modules

### Task 1.1: Add Supabase provider starter module

**Files:**

- Create: `src/lib/providers/supabase/client.ts`
- Create: `src/lib/providers/supabase/auth.ts`
- Create: `src/lib/providers/supabase/api.ts`
- Create: `src/lib/providers/supabase/index.ts`
- Create: `src/lib/providers/supabase/__tests__/auth.test.ts`
- Modify: `src/lib/setup/env-contract.ts`
- Modify: `scripts/setup/run.mjs`
- Modify: `scripts/setup/output.mjs`
- Install: `@supabase/supabase-js`

**Step 1: Write the failing test**

```ts
// __tests__/auth.test.ts
import { supabaseAuthProvider } from "@/lib/providers/supabase/auth";
import type { AuthProvider } from "@/lib/auth/types";

describe("supabaseAuthProvider", () => {
  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = supabaseAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/providers/supabase/__tests__/auth.test.ts`
Expected: FAIL (files missing)

**Step 3: Write implementation**

Create Supabase starter module with:

- `client.ts`: `createClient` from `@supabase/supabase-js` using env vars
- `auth.ts`: full `AuthProvider` implementation
- `api.ts`: `ApiProviderAdapter` using supabase-js REST
- `index.ts`: barrel export

Add env keys to:

- `src/lib/setup/env-contract.ts`: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` for `supabase` provider
- `scripts/setup/run.mjs`: same keys in `PROVIDER_ENV_KEYS`
- `scripts/setup/output.mjs`: same keys in `PROVIDER_ENV_KEYS`

**Step 4: Verify test passes**

Run: `pnpm test src/lib/providers/supabase/__tests__/auth.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/providers/supabase/ src/lib/setup/env-contract.ts scripts/setup/run.mjs scripts/setup/output.mjs
git commit -m "feat(supabase): add provider starter module with auth and api adapters"
```

---

### Task 1.2: Add Convex provider starter module

**Files:**

- Create: `src/lib/providers/convex/client.ts`
- Create: `src/lib/providers/convex/auth.ts`
- Create: `src/lib/providers/convex/api.ts`
- Create: `src/lib/providers/convex/index.ts`
- Create: `src/lib/providers/convex/__tests__/auth.test.ts`
- Modify: `src/lib/setup/env-contract.ts`
- Modify: `scripts/setup/run.mjs`
- Modify: `scripts/setup/output.mjs`
- Install: `convex`

**Step 1: Write the failing test**

```ts
// __tests__/auth.test.ts
import { convexAuthProvider } from "@/lib/providers/convex/auth";
import type { AuthProvider } from "@/lib/auth/types";

describe("convexAuthProvider", () => {
  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = convexAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/providers/convex/__tests__/auth.test.ts`
Expected: FAIL (files missing)

**Step 3: Write implementation**

Create Convex starter module:

- `client.ts`: `ConvexReactClient` init using env var
- `auth.ts`: `AuthProvider` wrapping Convex auth helpers
- `api.ts`: `ApiProviderAdapter` using Convex client queries
- `index.ts`: barrel export
- Add env keys: `EXPO_PUBLIC_CONVEX_URL`

**Step 4: Verify test passes**

Run: `pnpm test src/lib/providers/convex/__tests__/auth.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/providers/convex/ src/lib/setup/env-contract.ts scripts/setup/run.mjs scripts/setup/output.mjs
git commit -m "feat(convex): add provider starter module with auth and api adapters"
```

---

### Task 1.3: Add Firebase provider starter module

**Files:**

- Create: `src/lib/providers/firebase/client.ts`
- Create: `src/lib/providers/firebase/auth.ts`
- Create: `src/lib/providers/firebase/api.ts`
- Create: `src/lib/providers/firebase/index.ts`
- Create: `src/lib/providers/firebase/__tests__/auth.test.ts`
- Modify: `src/lib/setup/env-contract.ts`
- Modify: `scripts/setup/run.mjs`
- Modify: `scripts/setup/output.mjs`
- Install: `firebase`

**Step 1: Write the failing test**

```ts
// __tests__/auth.test.ts
import { firebaseAuthProvider } from "@/lib/providers/firebase/auth";
import type { AuthProvider } from "@/lib/auth/types";

describe("firebaseAuthProvider", () => {
  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = firebaseAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/providers/firebase/__tests__/auth.test.ts`
Expected: FAIL (files missing)

**Step 3: Write implementation**

Create Firebase starter module:

- `client.ts`: `initializeApp`, `getAuth`, `getFirestore` using env vars
- `auth.ts`: `AuthProvider` wrapping `signInWithEmailAndPassword` etc.
- `api.ts`: `ApiProviderAdapter` using Firestore
- `index.ts`: barrel export
- Add env keys: `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`

**Step 4: Verify test passes**

Run: `pnpm test src/lib/providers/firebase/__tests__/auth.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/providers/firebase/ src/lib/setup/env-contract.ts scripts/setup/run.mjs scripts/setup/output.mjs
git commit -m "feat(firebase): add provider starter module with auth and api adapters"
```

---

### Task 1.4: Env contract test update + setup smoke

**Files:**

- Modify: `src/lib/setup/__tests__/env-contract.test.ts`

**Step 1: Update test**

Update existing env contract test to verify new keys are included:

```ts
it("includes provider-specific env keys", () => {
  const supabaseKeys = buildEnvContract({
    provider: "supabase",
    features: {
      auth: true,
      analytics: false,
      errorReporting: false,
      pushNotifications: false,
      payments: false,
    },
  });
  expect(supabaseKeys.requiredKeys).toContain("EXPO_PUBLIC_SUPABASE_URL");
  expect(supabaseKeys.requiredKeys).toContain("EXPO_PUBLIC_SUPABASE_ANON_KEY");
});
```

**Step 2: Run setup smoke**

Run: `pnpm run project:setup`
Expected: completes, regenerates artifacts without error

**Step 3: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 4: Commit**

```bash
git add src/lib/setup/__tests__/env-contract.test.ts
git commit -m "test(env): verify provider-specific env keys in contract"
```

---

## Wave 2 — Observability Vendor Wiring

### Task 2.1: Add Sentry crash provider

**Files:**

- Create: `src/lib/observability/providers/sentry/provider.ts`
- Create: `src/lib/observability/providers/sentry/__tests__/provider.test.ts`
- Modify: `src/providers/app-providers.tsx` (or root layout for Sentry.init)
- Modify: `src/lib/setup/env-contract.ts`
- Install: `@sentry/react-native`

**Step 1: Write the failing test**

```ts
// __tests__/provider.test.ts
import { createSentryCrashProvider } from "@/lib/observability/providers/sentry/provider";
import type { CrashProvider } from "@/lib/observability/providers/types";

describe("SentryCrashProvider", () => {
  it("conforms to CrashProvider contract", () => {
    const provider: CrashProvider = createSentryCrashProvider();
    expect(typeof provider.captureException).toBe("function");
    expect(typeof provider.captureMessage).toBe("function");
    expect(typeof provider.setUser).toBe("function");
    expect(typeof provider.setTag).toBe("function");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/observability/providers/sentry/__tests__/provider.test.ts`
Expected: FAIL (files missing)

**Step 3: Write implementation**

Create Sentry provider:

- `provider.ts`: wraps `@sentry/react-native` in `CrashProvider` contract
- Add `EXPO_PUBLIC_SENTRY_DSN` to env contract under `errorReporting` feature
- Add Sentry.init to app bootstrap

**Step 4: Verify test passes**

Run: `pnpm test src/lib/observability/providers/sentry/__tests__/provider.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/observability/providers/sentry/ src/providers/app-providers.tsx src/lib/setup/env-contract.ts
git commit -m "feat(sentry): add crash provider behind existing CrashProvider contract"
```

---

### Task 2.2: Add PostHog analytics provider

**Files:**

- Create: `src/lib/observability/providers/posthog/provider.ts`
- Create: `src/lib/observability/providers/posthog/__tests__/provider.test.ts`
- Modify: `src/providers/app-providers.tsx`
- Modify: `src/lib/setup/env-contract.ts`
- Install: `posthog-react-native`

**Step 1: Write the failing test**

```ts
// __tests__/provider.test.ts
import { createPostHogAnalyticsProvider } from "@/lib/observability/providers/posthog/provider";
import type { AnalyticsProvider } from "@/lib/observability/providers/types";

describe("PostHogAnalyticsProvider", () => {
  it("conforms to AnalyticsProvider contract", () => {
    const provider: AnalyticsProvider = createPostHogAnalyticsProvider();
    expect(typeof provider.identify).toBe("function");
    expect(typeof provider.track).toBe("function");
    expect(typeof provider.screen).toBe("function");
    expect(typeof provider.reset).toBe("function");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/observability/providers/posthog/__tests__/provider.test.ts`
Expected: FAIL (files missing)

**Step 3: Write implementation**

Create PostHog provider:

- `provider.ts`: wraps PostHog SDK in `AnalyticsProvider` contract
- Add `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` to env contract under `analytics` feature
- Wire PostHog.init and setObservabilityProviders in app bootstrap

**Step 4: Verify test passes**

Run: `pnpm test src/lib/observability/providers/posthog/__tests__/provider.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/observability/providers/posthog/ src/providers/app-providers.tsx src/lib/setup/env-contract.ts
git commit -m "feat(posthog): add analytics provider behind existing AnalyticsProvider contract"
```

---

### Task 2.3: Observability vendor wiring + end-to-end verification

**Files:**

- Modify: `src/lib/observability/providers/registry.ts`
- Modify: `src/providers/app-providers.tsx`

**Step 1: Verify existing wiring tests**

The existing `providers.test.ts` already tests that:

- noop fallback works when runtime validation is invalid
- providers can be set via `setObservabilityProviders`

Ensure these pass with the vendor providers.

**Step 2: Wire vendor init in app-providers**

In `app-providers.tsx` (or a dedicated observability init effect):

```ts
useEffect(() => {
  if (!setupResult.valid) return; // noop fallback handled by registry
  if (features.errorReporting && process.env.EXPO_PUBLIC_SENTRY_DSN) {
    Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });
    setObservabilityProviders({
      crash: createSentryCrashProvider(),
      analytics: getPostHogProvider(),
    });
  }
}, []);
```

**Step 3: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 4: Commit**

```bash
git add src/lib/observability/providers/registry.ts src/providers/app-providers.tsx
git commit -m "feat(observability): wire Sentry and PostHog at app boot behind setup gating"
```

---

## Wave 3 — Security Hardening

### Task 3.1: Add pre-commit Gitleaks hook to Lefthook

**Files:**

- Modify: `lefthook.yml`

**Step 1: Check current lefthook config**

Read `lefthook.yml` to understand current hook structure.

**Step 2: Add gitleaks pre-commit command**

```yaml
pre-commit:
  parallel: true
  commands:
    lint-staged:
      run: npx lint-staged
    gitleaks:
      run: gitleaks git --pre-commit --verbose
```

**Step 3: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 4: Commit**

```bash
git add lefthook.yml
git commit -m "feat(security): add pre-commit gitleaks hook to lefthook"
```

---

### Task 3.2: Add pre-commit dependency audit check

**Files:**

- Modify: `lefthook.yml`

**Step 1: Add dep audit as warning-only pre-commit**

```yaml
dep-audit:
  run: pnpm audit --audit-level high || echo "⚠ Dependency vulnerabilities found (non-blocking)"
  skip: true # optional: skip in CI since CI has its own audit job
```

Note: non-blocking (warning-only) to avoid slowing down development.

**Step 2: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 3: Commit**

```bash
git add lefthook.yml
git commit -m "feat(security): add pre-commit dependency audit warning hook"
```

---

### Task 3.3: Extend runtime config validation with warnings

**Files:**

- Modify: `src/lib/setup/runtime-validation.ts`
- Modify: `src/store/setup-store.ts`
- Modify: `src/lib/setup/__tests__/runtime-validation.test.ts`

**Step 1: Write the failing test**

```ts
it("includes warnings when running in production with missing keys", () => {
  const result = validateRuntimeSetup(
    { requiredKeys: ["EXPO_PUBLIC_API_URL"] },
    { EXPO_PUBLIC_APP_ENV: "production" },
  );
  expect(result.warnings).toHaveLength(1);
  expect(result.warnings[0]).toContain("Production");
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/setup/__tests__/runtime-validation.test.ts`
Expected: FAIL (warnings field missing)

**Step 3: Write implementation**

Extend `RuntimeSetupValidationResult` with `warnings` field:

```ts
type RuntimeSetupValidationResult = {
  valid: boolean;
  missingKeys: string[];
  warnings: string[];
};
```

Add production-mode detection that warns when required keys are missing in production.

**Step 4: Verify test passes**

Run: `pnpm test src/lib/setup/__tests__/runtime-validation.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/setup/runtime-validation.ts src/store/setup-store.ts src/lib/setup/__tests__/runtime-validation.test.ts
git commit -m "feat(security): extend runtime validation with production-mode warnings"
```

---

### Task 3.4: Add dependency audit allowlist + CI enforcement

**Files:**

- Create: `scripts/ci/check-audit.mjs`
- Create: `scripts/ci/audit-allowlist.json`
- Modify: `.github/workflows/security.yml`

**Step 1: Write the failing script test**

```bash
node scripts/ci/check-audit.mjs <(echo '{"advisories":{}}')
# Expected: exit 0 (no advisories)
node scripts/ci/check-audit.mjs <(echo '{"advisories":{"1234":{}}}')
# Expected: exit 1 (unknown advisory not in allowlist)
```

**Step 2: Create allowlist and check script**

`scripts/ci/audit-allowlist.json`:

```json
{
  "known_advisories": []
}
```

`scripts/ci/check-audit.mjs`:

```js
#!/usr/bin/env node
import { readFileSync } from "fs";
const report = JSON.parse(readFileSync(process.argv[2], "utf8"));
const allowlist = JSON.parse(
  readFileSync("scripts/ci/audit-allowlist.json", "utf8"),
);
const advisories = Object.keys(report.advisories ?? {});
const unknown = advisories.filter(
  (a) => !allowlist.known_advisories.includes(a),
);
if (unknown.length > 0) {
  console.error(`Unknown advisories: ${unknown.join(", ")}`);
  process.exit(1);
}
console.log("All advisories known and accounted for.");
```

**Step 3: Update security CI workflow**

```yaml
- name: Dependency audit
  run: |
    pnpm audit --audit-level high --json > audit-report.json || true
    node scripts/ci/check-audit.mjs audit-report.json
```

**Step 4: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 5: Commit**

```bash
git add scripts/ci/ scripts/ci/audit-allowlist.json .github/workflows/security.yml
git commit -m "feat(security): add dependency audit allowlist and CI enforcement script"
```

---

### Task 3.5: Add default API security headers

**Files:**

- Modify: `src/lib/api/client.ts`
- Create: `src/lib/api/__tests__/security-headers.test.ts`

**Step 1: Write the failing test**

```ts
// __tests__/security-headers.test.ts
import { apiClient } from "@/lib/api/client";

describe("API security headers", () => {
  it("includes X-Content-Type-Options: nosniff", () => {
    const headers = apiClient.defaults.headers.common;
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("includes X-Frame-Options: DENY", () => {
    const headers = apiClient.defaults.headers.common;
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });

  it("includes Referrer-Policy header", () => {
    const headers = apiClient.defaults.headers.common;
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });
});
```

**Step 2: Verify test fails**

Run: `pnpm test src/lib/api/__tests__/security-headers.test.ts`
Expected: FAIL (headers not set)

**Step 3: Write implementation**

Add security headers to axios client defaults:

```ts
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

Object.assign(apiClient.defaults.headers.common, securityHeaders);
```

**Step 4: Verify test passes**

Run: `pnpm test src/lib/api/__tests__/security-headers.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 6: Commit**

```bash
git add src/lib/api/client.ts src/lib/api/__tests__/security-headers.test.ts
git commit -m "feat(security): add default security headers to API client"
```

---

### Task 3.6: P1 final verification and artifact refresh

**Step 1: Run setup smoke**

Run: `pnpm run project:setup`
Expected: completes, regenerates artifacts without error

**Step 2: Run full gate**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
  Expected: all PASS

**Step 3: Verify working tree**

Run: `git status`
Expected: clean (all generated artifacts committed)

**Step 4: Verify commit log**

Run: `git log --oneline`
Expected: all P1 tasks committed with conventional commit messages

**Step 5: Update docs**

- Update `docs/project-health.md` with P1 status
- Update `README.md` with new provider modules and security features
