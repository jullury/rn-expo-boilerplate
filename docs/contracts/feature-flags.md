# Feature Flags Backend Contract

Endpoint is configured by `EXPO_PUBLIC_FLAGS_ENDPOINT`.

The remote flag request is gated by setup-generated feature config at
`src/lib/setup/generated/feature-flags.ts`. If `analytics` is disabled by
`pnpm run project:setup`, the app skips remote flag fetching and uses local defaults.

## Response schema

```json
{
  "newSignInExperience": true,
  "enableOfflineBanner": false
}
```

## Validation behavior

- Client validates response shape with zod schema at
  `src/lib/feature-flags/contract.ts`.
- Invalid payloads fall back to local defaults.
- Validation failures are logged through observability warnings.
