# Feature Flags Backend Contract

Endpoint is configured by `EXPO_PUBLIC_FLAGS_ENDPOINT`.

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
