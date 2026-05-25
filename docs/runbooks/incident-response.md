# Incident Response Runbook

## Severity Levels

- **SEV1**: Core app unusable or data/security impact
- **SEV2**: Critical feature degraded for many users
- **SEV3**: Limited degradation/workaround exists

## First 15 Minutes

1. Acknowledge incident and assign commander
2. Capture timestamp and affected scope
3. Stabilize: disable risky flags if applicable
4. Start status updates every 15 minutes

## Investigation Checklist

- Check recent releases and commits
- Check runtime logs/crash capture events
- Reproduce issue in controlled environment
- Identify blast radius and impacted user segment

## Mitigation

- Prefer fast safe mitigation (flag off, rollback, config revert)
- Avoid speculative hotfixes without reproducible evidence

## Resolution and Follow-up

1. Verify recovery metrics
2. Publish resolution note
3. Run postmortem within 48 hours
4. Track corrective actions to completion
