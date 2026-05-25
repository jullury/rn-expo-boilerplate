# P0 Boilerplate Completeness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Productize P0 completeness by implementing contract-driven auth lifecycle, pluggable observability providers with safe fallbacks, setup/runtime env contract enforcement, and stronger E2E smoke coverage.

**Architecture:** Introduce strict provider boundaries (`AuthProvider`, `AnalyticsProvider`, `CrashProvider`) and wire runtime through generated setup artifacts plus boot-time contract validation. Keep production-safe degraded modes when contracts/env are invalid. Expand E2E and unit coverage to enforce behavior and regression protection.

**Tech Stack:** TypeScript, Expo SDK 56, Axios, Zustand, zod, Jest, Maestro

---

### Task 1: Add provider contracts for auth and observability

**Files:**

- Create: `src/lib/auth/types.ts`
- Create: `src/lib/observability/providers/types.ts`
- Test: `src/lib/auth/__tests__/types.test.ts`

**Step 1: Write the failing test**

```ts
import type { AuthProvider } from "@/lib/auth/types";
import type {
  AnalyticsProvider,
  CrashProvider,
} from "@/lib/observability/providers/types";

describe("provider contracts", () => {
  it("auth provider exposes required lifecycle methods", () => {
    const provider = {} as AuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.signOut).toBe("function");
  });

  it("observability providers expose required methods", () => {
    const analytics = {} as AnalyticsProvider;
    const crash = {} as CrashProvider;
    expect(typeof analytics.track).toBe("function");
    expect(typeof crash.captureException).toBe("function");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/auth/__tests__/types.test.ts`
Expected: FAIL (missing contract files)

**Step 3: Write minimal implementation**

Define exact interfaces and session payload types for:

- `AuthProvider`
- `AnalyticsProvider`
- `CrashProvider`

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/auth/__tests__/types.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/auth/types.ts src/lib/observability/providers/types.ts src/lib/auth/__tests__/types.test.ts
git commit -m "feat(core): add auth and observability provider contracts"
```

### Task 2: Implement setup env contract generation and schema

**Files:**

- Create: `src/lib/setup/env-contract.ts`
- Modify: `src/lib/setup/types.ts`
- Modify: `src/lib/setup/generator.ts`
- Test: `src/lib/setup/__tests__/env-contract.test.ts`

**Step 1: Write the failing test**

```ts
import { buildEnvContract } from "@/lib/setup/env-contract";

it("generates required env keys for selected provider and enabled features", () => {
  const contract = buildEnvContract({
    provider: "supabase",
    features: {
      auth: true,
      analytics: true,
      errorReporting: true,
      pushNotifications: false,
      payments: false,
    },
  });
  expect(contract.requiredKeys).toContain("EXPO_PUBLIC_API_URL");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/setup/__tests__/env-contract.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Add env contract builder and generation output file:

- `src/lib/setup/generated/env-contract.ts`

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/setup/__tests__/env-contract.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/setup/env-contract.ts src/lib/setup/types.ts src/lib/setup/generator.ts src/lib/setup/__tests__/env-contract.test.ts
git commit -m "feat(setup): generate provider and feature env contracts"
```

### Task 3: Add runtime setup validation and safe degraded mode

**Files:**

- Create: `src/lib/setup/runtime-validation.ts`
- Modify: `src/providers/app-providers.tsx`
- Create: `src/store/setup-store.ts`
- Test: `src/lib/setup/__tests__/runtime-validation.test.ts`

**Step 1: Write the failing test**

```ts
import { validateRuntimeSetup } from "@/lib/setup/runtime-validation";

it("returns invalid and missing keys when required env values are absent", () => {
  const result = validateRuntimeSetup(
    { requiredKeys: ["EXPO_PUBLIC_API_URL"] },
    {},
  );
  expect(result.valid).toBe(false);
  expect(result.missingKeys).toContain("EXPO_PUBLIC_API_URL");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/setup/__tests__/runtime-validation.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Implement runtime validator + provider bootstrap behavior:

- store validation result
- keep app running with feature/provider-safe degradation

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/setup/__tests__/runtime-validation.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/setup/runtime-validation.ts src/providers/app-providers.tsx src/store/setup-store.ts src/lib/setup/__tests__/runtime-validation.test.ts
git commit -m "feat(runtime): validate setup env contract with safe degradation"
```

### Task 4: Productize auth provider and session lifecycle

**Files:**

- Create: `src/lib/auth/provider.ts`
- Create: `src/lib/auth/errors.ts`
- Modify: `src/store/auth-store.ts`
- Modify: `src/lib/storage/secure.ts`
- Test: `src/lib/auth/__tests__/provider.test.ts`

**Step 1: Write the failing test**

```ts
import { createAuthProvider } from "@/lib/auth/provider";

it("restores session from secure storage and refreshes when expired", async () => {
  const provider = createAuthProvider(/* mocked deps */);
  const result = await provider.restoreSession();
  expect(result.status).toBe("authenticated");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/auth/__tests__/provider.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Implement provider methods:

- `signIn`
- `restoreSession`
- `refreshSession` (coalesced)
- `signOut`
- typed error mapping

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/auth/__tests__/provider.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/auth/provider.ts src/lib/auth/errors.ts src/store/auth-store.ts src/lib/storage/secure.ts src/lib/auth/__tests__/provider.test.ts
git commit -m "feat(auth): add contract-driven sign-in refresh restore lifecycle"
```

### Task 5: Wire auth provider into API client interceptors

**Files:**

- Modify: `src/lib/api/client.ts`
- Modify: `src/lib/api/errors.ts`
- Test: `src/lib/api/__tests__/auth-interceptor.test.ts`

**Step 1: Write the failing test**

```ts
it("refreshes token once on 401 and retries request", async () => {
  // mock first 401 then 200
  // expect refreshSession called once
  // expect retried request success
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/api/__tests__/auth-interceptor.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Add interceptor flow:

- inject token on request
- refresh once on 401
- retry original request once
- sign out on unrecoverable auth failure

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/api/__tests__/auth-interceptor.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/api/client.ts src/lib/api/errors.ts src/lib/api/__tests__/auth-interceptor.test.ts
git commit -m "feat(api): integrate auth provider token and 401 refresh handling"
```

### Task 6: Productize observability provider adapters with no-op fallback

**Files:**

- Create: `src/lib/observability/providers/noop.ts`
- Create: `src/lib/observability/providers/registry.ts`
- Modify: `src/lib/observability/analytics.ts`
- Modify: `src/lib/observability/crash-reporting.ts`
- Test: `src/lib/observability/__tests__/providers.test.ts`

**Step 1: Write the failing test**

```ts
import { getObservabilityProviders } from "@/lib/observability/providers/registry";

it("falls back to noop providers when runtime setup is invalid", () => {
  const providers = getObservabilityProviders({ valid: false });
  expect(providers.analytics.name).toBe("noop");
  expect(providers.crash.name).toBe("noop");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/observability/__tests__/providers.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Implement provider registry with explicit no-op fallback selection.

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/observability/__tests__/providers.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/observability/providers/noop.ts src/lib/observability/providers/registry.ts src/lib/observability/analytics.ts src/lib/observability/crash-reporting.ts src/lib/observability/__tests__/providers.test.ts
git commit -m "feat(observability): add provider registry with noop fallback"
```

### Task 7: Add observability redaction + base event schema enforcement

**Files:**

- Create: `src/lib/observability/redaction.ts`
- Modify: `src/lib/observability/logger.ts`
- Modify: `src/lib/observability/analytics.ts`
- Test: `src/lib/observability/__tests__/redaction.test.ts`

**Step 1: Write the failing test**

```ts
import { redactPayload } from "@/lib/observability/redaction";

it("redacts auth tokens and sensitive headers", () => {
  const result = redactPayload({ authorization: "Bearer abc", token: "abc" });
  expect(result.authorization).toBe("[REDACTED]");
  expect(result.token).toBe("[REDACTED]");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/observability/__tests__/redaction.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Add redaction utility and enforce base event fields before provider emission.

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/observability/__tests__/redaction.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/observability/redaction.ts src/lib/observability/logger.ts src/lib/observability/analytics.ts src/lib/observability/__tests__/redaction.test.ts
git commit -m "feat(observability): enforce redaction and event schema defaults"
```

### Task 8: Emit auth and API lifecycle observability events

**Files:**

- Modify: `src/lib/auth/provider.ts`
- Modify: `src/lib/api/client.ts`
- Test: `src/lib/auth/__tests__/observability-events.test.ts`

**Step 1: Write the failing test**

```ts
it("emits sign_in_success and token_refresh_failure events", async () => {
  // execute auth flows
  // assert analytics provider track called with required event names
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/auth/__tests__/observability-events.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Emit standardized observability events across auth + API lifecycle points.

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/auth/__tests__/observability-events.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/auth/provider.ts src/lib/api/client.ts src/lib/auth/__tests__/observability-events.test.ts
git commit -m "feat(observability): emit auth and api lifecycle analytics events"
```

### Task 9: Expand Maestro smoke flows for P0 critical paths

**Files:**

- Modify: `.maestro/smoke-auth-flow.yaml`
- Create: `.maestro/smoke-auth-failure-flow.yaml`
- Create: `.maestro/smoke-session-restore-flow.yaml`
- Create: `.maestro/smoke-offline-auth-flow.yaml`
- Modify: `.github/workflows/ci.yml`

**Step 1: Write failing smoke assertion update**

Define expected assertions for each flow file (existing CI dry-run should fail before new files exist).

**Step 2: Run verification to observe failure**

Run: `~/.maestro/bin/maestro test --dry-run .maestro/smoke-auth-failure-flow.yaml`
Expected: FAIL (file missing)

**Step 3: Write minimal implementation**

Create/update Maestro flows for:

- auth success
- auth failure
- session restore
- offline auth fallback

Update CI dry-run list.

**Step 4: Run dry-run checks to verify pass**

Run:

- `~/.maestro/bin/maestro test --dry-run .maestro/smoke-auth-flow.yaml`
- `~/.maestro/bin/maestro test --dry-run .maestro/smoke-auth-failure-flow.yaml`
- `~/.maestro/bin/maestro test --dry-run .maestro/smoke-session-restore-flow.yaml`
- `~/.maestro/bin/maestro test --dry-run .maestro/smoke-offline-auth-flow.yaml`
  Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add .maestro/smoke-auth-flow.yaml .maestro/smoke-auth-failure-flow.yaml .maestro/smoke-session-restore-flow.yaml .maestro/smoke-offline-auth-flow.yaml .github/workflows/ci.yml
git commit -m "test(e2e): add p0 auth offline and session smoke flows"
```

### Task 10: Setup command UX hardening (diff summary, env warnings)

**Files:**

- Modify: `scripts/setup/run.mjs`
- Modify: `scripts/setup/output.mjs`
- Test: `src/lib/setup/__tests__/setup-cli.test.ts`

**Step 1: Write the failing test**

```ts
it("prints changed provider/features and missing env warnings", async () => {
  // run setup with old/new config
  // assert output includes diff summary and missing key warnings
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/setup/__tests__/setup-cli.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

Add output summary:

- previous vs new provider
- feature toggles changed
- required env keys list and missing subset

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/setup/__tests__/setup-cli.test.ts`
Expected: PASS

**Step 5: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 6: Commit**

```bash
git add scripts/setup/run.mjs scripts/setup/output.mjs src/lib/setup/__tests__/setup-cli.test.ts
git commit -m "feat(setup): add reconfigure diff and env requirement summaries"
```

### Task 11: Documentation update for P0 contracts and operations

**Files:**

- Modify: `README.md`
- Modify: `docs/contracts/feature-flags.md`
- Create: `docs/contracts/setup-runtime-contract.md`
- Modify: `docs/project-health.md`

**Step 1: Write doc checklist assertions**

Checklist:

- auth lifecycle documented
- observability provider/fallback documented
- setup runtime contract and env validation documented
- command references use `pnpm run project:setup`

**Step 2: Run docs consistency check (manual + grep)**

Run: `pnpm test src/lib/setup/__tests__/script-command.test.ts`
Expected: PASS

**Step 3: Update docs**

Add operational and contract details with exact paths.

**Step 4: Verify quality gates**

Run:

- `pnpm typecheck`
- `pnpm lint`
  Expected: PASS

**Step 5: Commit**

```bash
git add README.md docs/contracts/feature-flags.md docs/contracts/setup-runtime-contract.md docs/project-health.md
git commit -m "docs(p0): document auth observability and setup runtime contracts"
```

### Task 12: P0 final verification and artifact refresh

**Files:**

- Verify: `app.setup.json`
- Verify: `src/lib/setup/generated/*`
- Verify: `src/lib/api/providers/generated/*`
- Verify: `src/features/generated/*`
- Verify: `src/app/generated/*`

**Step 1: Run setup smoke**

Run: `pnpm run project:setup`
Expected: completes and prints summary without crash

**Step 2: Run full gate**

Run:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`

Expected: all PASS

**Step 3: Commit generated artifacts if changed**

```bash
git add app.setup.json src/lib/setup/generated src/lib/api/providers/generated src/features/generated src/app/generated
git commit -m "chore(p0): refresh setup-generated artifacts"
```
