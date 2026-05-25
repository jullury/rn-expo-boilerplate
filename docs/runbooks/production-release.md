# Production Release Runbook

## Preconditions

- CI green on target commit (`lint`, `typecheck`, `test`)
- No open SEV incidents
- Release notes reviewed

## Release Steps

1. Merge release-ready PRs into `main`
2. Confirm semantic-release workflow succeeds
3. Validate generated GitHub release + `CHANGELOG.md`
4. Trigger EAS production build if needed
5. Verify smoke checks on target environments

## Post-release Validation

- App boots and sign-in route guard works
- Network/offline banner behavior is sane
- Error boundary renders fallback safely
- Notification permission prompts are non-blocking

## Rollback

1. Revert offending PR commit(s)
2. Merge revert to `main`
3. Allow semantic-release patch to publish rollback version
4. If needed, pause rollout by disabling relevant feature flags
