# Security Policy

## Supported versions

Security fixes are applied to the latest default branch (`main`).

## Reporting a vulnerability

Please report vulnerabilities privately to the maintainers. Do not open
public issues for active vulnerabilities.

Include:

- Impact summary
- Reproduction steps
- Affected version/commit
- Suggested mitigation (if available)

## Security controls in this repository

- Secret scanning with Gitleaks in CI (`.github/workflows/security.yml`)
- Dependency audit gate in CI
- Conventional release process with changelog traceability
