# P2 CLI UX Polish Implementation Plan

**Goal:** Improve `pnpm run project:setup` usability and automation-readiness.

## Scope (P2-A)

### Task A1: Non-interactive flags

- Add `--provider <supabase|convex|firebase|custom>`
- Add `--features <comma,separated,feature,list>`
- Add `--yes` to skip prompts and use defaults for unspecified values

### Task A2: Dry run mode

- Add `--dry-run` to compute and print output without writing files
- Keep summary output behavior consistent with apply mode

### Task A3: JSON output

- Add `--json` to emit machine-readable summary:
  - mode (`apply` or `dry-run`)
  - provider
  - features
  - computed changes
  - environment requirements

### Task A4: Validation and tests

- Validate invalid provider and feature names with clear errors
- Add CLI integration tests for:
  - `--dry-run --json` no-write behavior
  - non-interactive apply mode with provider/features flags

## Out of Scope (next P2 slices)

- Full `--help` and rich CLI UX
- `--root-dir` override for setup target
- JSON schema versioning for CLI output
- Boilerplate health self-diagnostic command

## Acceptance Criteria

- Existing interactive flow remains unchanged when flags are omitted
- New flags are honored and deterministic
- `--dry-run` does not create or modify generated artifacts
- `--json` output is valid JSON with required keys
- `pnpm test`, `pnpm typecheck`, `pnpm lint` all pass
