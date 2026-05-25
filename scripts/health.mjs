#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const CHECKS = [
  {
    key: "app.setup.json",
    type: "path",
    target: "app.setup.json",
    weight: 20,
    recommendation: "Run `pnpm run project:setup` to generate base setup config.",
  },
  {
    key: "generated.provider-selection",
    type: "path",
    target: "src/lib/setup/generated/provider-selection.ts",
    weight: 15,
    recommendation:
      "Regenerate setup artifacts (`pnpm run project:setup`) to restore provider selection file.",
  },
  {
    key: "generated.feature-flags",
    type: "path",
    target: "src/lib/setup/generated/feature-flags.ts",
    weight: 15,
    recommendation:
      "Regenerate setup artifacts (`pnpm run project:setup`) to restore feature flags file.",
  },
  {
    key: "generated.env-contract",
    type: "path",
    target: "src/lib/setup/generated/env-contract.ts",
    weight: 15,
    recommendation:
      "Regenerate setup artifacts (`pnpm run project:setup`) to restore env contract file.",
  },
  {
    key: "scripts.project:setup",
    type: "package-script",
    target: "project:setup",
    expected: "node ./scripts/setup.mjs",
    weight: 10,
    recommendation:
      "Ensure package.json includes `project:setup` script mapped to `node ./scripts/setup.mjs`.",
  },
  {
    key: "scripts.project:health",
    type: "package-script",
    target: "project:health",
    expected: "node ./scripts/health.mjs",
    weight: 10,
    recommendation:
      "Ensure package.json includes `project:health` script mapped to `node ./scripts/health.mjs`.",
  },
  {
    key: "ci.security-workflow",
    type: "path",
    target: ".github/workflows/security.yml",
    weight: 15,
    recommendation:
      "Restore `.github/workflows/security.yml` to keep CI security checks active.",
  },
];

async function pathExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadPackageScripts(cwd) {
  try {
    const pkgPath = path.join(cwd, "package.json");
    const raw = await readFile(pkgPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed?.scripts ?? {};
  } catch {
    return {};
  }
}

async function evaluateCheck(check, cwd, packageScripts) {
  if (check.type === "path") {
    const absolutePath = path.join(cwd, check.target);
    const ok = await pathExists(absolutePath);
    return {
      key: check.key,
      ok,
      weight: check.weight,
      recommendation: check.recommendation,
    };
  }

  if (check.type === "package-script") {
    const ok = packageScripts[check.target] === check.expected;
    return {
      key: check.key,
      ok,
      weight: check.weight,
      recommendation: check.recommendation,
    };
  }

  return {
    key: check.key,
    ok: false,
    weight: check.weight,
    recommendation: "Unknown check type configuration.",
  };
}

async function main() {
  const cwd = process.cwd();
  const packageScripts = await loadPackageScripts(cwd);
  const checks = await Promise.all(
    CHECKS.map((check) => evaluateCheck(check, cwd, packageScripts)),
  );

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const score = checks.reduce(
    (sum, check) => sum + (check.ok ? check.weight : 0),
    0,
  );
  const recommendations = checks
    .filter((check) => !check.ok)
    .map((check) => check.recommendation);

  const payload = {
    schemaVersion: 2,
    score,
    passed,
    total,
    checks,
    recommendations,
  };

  console.log(JSON.stringify(payload, null, 2));

  if (score < 100) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
