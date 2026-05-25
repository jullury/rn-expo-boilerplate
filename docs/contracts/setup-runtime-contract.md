# Setup Runtime Contract

The setup system produces runtime artifacts that enforce provider/feature contracts
at boot time. This document describes the validation lifecycle and the contract
boundaries each system must respect.

## Validation Lifecycle

```
pnpm run project:setup               (build time: generates managed artifacts)
       ↓
app.setup.json                        (source of truth for provider + feature config)
       ↓
generated/env-contract.ts            (static list of required process.env keys)
       ↓
app-providers.tsx boot validateRuntimeSetup()  (runtime: compares env against contract)
       ↓
setup-store.ts                       (validation result: valid + missingKeys)
       ↓
observability providers registry     (selects noop or real provider based on validity)
```

### 1. Build Time — `pnpm run project:setup`

Generates managed files under `src/lib/setup/generated/`:

| File                    | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `provider-selection.ts` | Exports `selectedProvider` literal type                 |
| `feature-flags.ts`      | Exports `setupEnabledFeatures` with per-feature boolean |
| `env-contract.ts`       | Exports `setupEnvContract` with `requiredKeys` array    |
| `adapter-resolver.ts`   | Resolves `ApiProviderAdapter` by provider               |

Disabled managed features are physically removed from `src/features/generated/*`
and `src/app/generated/*`.

### 2. Generated Env Contract (`env-contract.ts`)

Built by `src/lib/setup/env-contract.ts` — `buildEnvContract()`:

```ts
type BuildEnvContractInput = {
  provider: SetupProvider; // "supabase" | "convex" | "firebase" | "custom"
  features: SetupFeatures; // { auth, analytics, errorReporting, pushNotifications, payments }
};

type SetupEnvContract = {
  requiredKeys: string[]; // sorted, deduped list of required env var keys
};
```

**Provider env requirements:**

| Provider   | Required keys         |
| ---------- | --------------------- |
| `supabase` | `EXPO_PUBLIC_API_URL` |
| `convex`   | `EXPO_PUBLIC_API_URL` |
| `firebase` | `EXPO_PUBLIC_API_URL` |
| `custom`   | `EXPO_PUBLIC_API_URL` |

**Feature env requirements (when enabled):**

| Feature     | Required keys                |
| ----------- | ---------------------------- |
| `analytics` | `EXPO_PUBLIC_FLAGS_ENDPOINT` |

The contract merges provider and enabled-feature keys into a single deduped list.

### 3. Runtime Validation (`runtime-validation.ts`)

Called once during `app-providers.tsx` boot effect:

```ts
function validateRuntimeSetup(
  contract: { requiredKeys: readonly string[] },
  env: Record<string, string | undefined>,
): { valid: boolean; missingKeys: string[] };
```

- Reads `process.env` (or equivalent) for each required key
- Returns `valid: false` and a `missingKeys` array if any key is undefined or empty
- Result is stored in `useSetupStore` for downstream consumers

### 4. Setup Store (`setup-store.ts`)

Zustand store that holds the runtime validation result:

```ts
type SetupStoreState = {
  isRuntimeValid: boolean;
  missingEnvKeys: string[];
  setRuntimeValidation: (result: {
    valid: boolean;
    missingKeys: string[];
  }) => void;
};
```

Any component or provider can read this store to check setup health at runtime.

## Auth Provider Contract

### Contract (`src/lib/auth/types.ts`)

```ts
type AuthProvider = {
  signIn(input: SignInInput): Promise<AuthSession>;
  signOut(): Promise<void>;
  refreshSession(): Promise<AuthSession>;
  restoreSession(): Promise<AuthRestoreResult>;
  getAccessToken(): Promise<string | null>;
};
```

### Default Implementation (`src/lib/auth/provider.ts`)

- Stores session tokens + user in SecureStore
- `restoreSession()` reads persisted tokens from SecureStore
- `refreshSession()` uses request coalescing (single in-flight refresh)
- Emits observability events: `auth.sign_in_success`, `auth.sign_out`, `auth.token_refresh_success`

### Runtime Injection (`src/lib/auth/runtime-provider.ts`)

```ts
getRuntimeAuthProvider(): AuthProvider    // returns the active provider (default: unconfigured stub)
setRuntimeAuthProvider(provider: AuthProvider): void  // must be called at boot with real provider
```

The runtime provider defaults to an `unconfiguredAuthProvider` stub that throws
on `signIn`/`refreshSession` and returns `signed_out` on `restoreSession`.

### Auth Error Types (`src/lib/auth/errors.ts`)

```ts
type AuthErrorCode =
  | "invalid_credentials"
  | "session_expired"
  | "network_unavailable"
  | "provider_unconfigured";
class AuthError extends Error {
  code: AuthErrorCode;
}
```

### API Token Injection (`src/lib/api/auth-retry.ts`)

The axios client is wired to:

1. Inject `Authorization: Bearer <token>` on outgoing requests via request interceptor
2. On 401 response, call `handle401Retry()` which:
   - Calls `getRuntimeAuthProvider().refreshSession()` to get a fresh token
   - Replays the original request once
   - If refresh fails, propagates the 401 to the caller for sign-out handling

## Observability Provider Contract

### Analytics Provider (`src/lib/observability/providers/types.ts`)

```ts
type AnalyticsProvider = {
  identify(userId: string, traits?: AnalyticsPayload): void;
  track(name: string, payload?: AnalyticsPayload): void;
  screen(name: string, payload?: AnalyticsPayload): void;
  reset(): void;
};
```

### Crash Provider

```ts
type CrashProvider = {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, context?: Record<string, unknown>): void;
  setUser(user: { id: string; email?: string } | null): void;
  setTag(key: string, value: string): void;
};
```

### Registry & Noop Fallback (`src/lib/observability/providers/registry.ts`)

- When runtime validation is `valid: false` → all observability calls go to no-op providers
- When runtime validation is `valid: true` → calls go to the configured provider (default: still noop until a real vendor is wired via `setObservabilityProviders()`)
- `setObservabilityProviders({ analytics, crash })` allows injection of real vendor adapters

### Payload Redaction (`src/lib/observability/redaction.ts`)

Sensitive keys (`authorization`, `token`, `accessToken`, `refreshToken`, `password`)
are automatically redacted to `[REDACTED]` from all logged payloads. This is applied
in the logger module before output.

### Auth Lifecycle Events

| Event                        | Trigger                            | Payload      |
| ---------------------------- | ---------------------------------- | ------------ |
| `auth.sign_in_success`       | After `signIn()` completes         | `{ userId }` |
| `auth.sign_out`              | After `signOut()` clears session   | (none)       |
| `auth.token_refresh_success` | After `refreshSession()` completes | `{ userId }` |

## Safe Degradation

1. **Invalid env contract** → observability falls back to no-op providers; app continues to function
2. **Auth provider not injected** → default provider returns `signed_out` on restore, throws on sign-in/refresh
3. **Observability provider not set** → no-op defaults used; logger still writes to console
4. **Missing env vars** → setup store logs missing keys; components can read `useSetupStore` to show warnings

## Extending the Contract

To add a new required env key:

1. Add the key to `env-contract.ts` — either under `providerRequiredKeys` or `featureRequiredKeys`
2. Re-run `pnpm run project:setup` to regenerate `env-contract.ts`
3. The new key is automatically required at runtime validation

To add a new provider:

1. Create the adapter under `src/lib/api/providers/<name>/`
2. Add the provider name to `src/lib/setup/types.ts` `setupProviders`
3. Add env keys to `env-contract.ts`
4. Update `scripts/setup/run.mjs` resolver map
5. Re-run `pnpm run project:setup`
