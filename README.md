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
- `src/providers` - app-level providers
- `src/store` - global state stores

## EAS

`eas.json` includes:

- `preview` (internal distribution)
- `production` (auto increment enabled)
