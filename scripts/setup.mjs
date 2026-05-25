#!/usr/bin/env node

import { printSetupSummary } from "./setup/output.mjs";
import { selectFeatures, selectProvider } from "./setup/prompts.mjs";
import { runSetup } from "./setup/run.mjs";

const SUPPORTED_PROVIDERS = ["supabase", "convex", "firebase", "custom"];
const SUPPORTED_FEATURES = [
  "auth",
  "analytics",
  "errorReporting",
  "pushNotifications",
  "payments",
];

function parseArgs(argv) {
  const options = {
    provider: undefined,
    features: undefined,
    rootDir: undefined,
    yes: false,
    dryRun: false,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--yes") {
      options.yes = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--provider") {
      options.provider = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--features") {
      options.features = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--root-dir") {
      options.rootDir = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return options;
}

function printHelp() {
  console.log("Usage: node ./scripts/setup.mjs [options]");
  console.log("");
  console.log("Options:");
  console.log("  --provider <name>        Provider: supabase|convex|firebase|custom");
  console.log("  --features <list>        Comma-separated enabled features");
  console.log("  --yes                    Non-interactive mode for unspecified values");
  console.log("  --dry-run                Compute and print result without writing files");
  console.log("  --json                   Emit machine-readable JSON summary");
  console.log("  --root-dir <path>        Target project directory (default: cwd)");
  console.log("  --help, -h               Show this help output");
}

function toPresetFeatures(input, baseFeatures) {
  if (!input) {
    return undefined;
  }

  const enabled = new Set(
    input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const next = { ...baseFeatures };
  for (const key of SUPPORTED_FEATURES) {
    next[key] = enabled.has(key);
  }
  return next;
}

function validateOptions(options) {
  if (options.provider && !SUPPORTED_PROVIDERS.includes(options.provider)) {
    throw new Error(
      `Invalid --provider value: ${options.provider}. Expected one of: ${SUPPORTED_PROVIDERS.join(", ")}`,
    );
  }

  if (options.features) {
    const requested = options.features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const invalid = requested.filter((item) => !SUPPORTED_FEATURES.includes(item));
    if (invalid.length > 0) {
      throw new Error(
        `Invalid --features value(s): ${invalid.join(", ")}. Expected subset of: ${SUPPORTED_FEATURES.join(", ")}`,
      );
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }
  validateOptions(options);

  const selectProviderPrompt = options.yes
    ? async (defaultProvider) => defaultProvider
    : selectProvider;

  const selectFeaturesPrompt = options.yes
    ? async (defaultFeatures) => defaultFeatures
    : selectFeatures;

  let presetFeatures;
  if (options.features) {
    const base = {
      auth: true,
      analytics: true,
      errorReporting: true,
      pushNotifications: true,
      payments: false,
    };
    presetFeatures = toPresetFeatures(options.features, base);
  }

  const { previous, next } = await runSetup({
    rootDir: options.rootDir,
    prompts: {
      selectProvider: selectProviderPrompt,
      selectFeatures: selectFeaturesPrompt,
    },
    presetProvider: options.provider,
    presetFeatures,
    dryRun: options.dryRun,
  });

  if (options.json) {
    const { buildSetupSummary } = await import("./setup/output.mjs");
    const payload = {
      schemaVersion: 1,
      mode: options.dryRun ? "dry-run" : "apply",
      ...buildSetupSummary(next, previous),
    };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  printSetupSummary(next, previous, { dryRun: options.dryRun });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
