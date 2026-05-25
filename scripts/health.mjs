#!/usr/bin/env node

import { access } from "node:fs/promises";
import path from "node:path";

const REQUIRED_PATHS = [
  "app.setup.json",
  "src/lib/setup/generated/provider-selection.ts",
  "src/lib/setup/generated/feature-flags.ts",
  "src/lib/setup/generated/env-contract.ts",
];

async function pathExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const checks = await Promise.all(
    REQUIRED_PATHS.map(async (relativePath) => {
      const absolutePath = path.join(process.cwd(), relativePath);
      const ok = await pathExists(absolutePath);
      return {
        key: relativePath,
        ok,
      };
    }),
  );

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  const payload = {
    schemaVersion: 1,
    score,
    passed,
    total,
    checks,
  };

  console.log(JSON.stringify(payload, null, 2));

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
