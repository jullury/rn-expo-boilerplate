const PROVIDER_ENV_KEYS = {
  supabase: ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_ANON_KEY"],
  convex: ["EXPO_PUBLIC_CONVEX_URL"],
  firebase: [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ],
  custom: ["EXPO_PUBLIC_API_URL"],
};

const FEATURE_ENV_KEYS = {
  analytics: ["EXPO_PUBLIC_FLAGS_ENDPOINT"],
  errorReporting: ["EXPO_PUBLIC_SENTRY_DSN"],
};

function computeChanges(previous, next) {
  const changes = [];
  if (previous.provider !== next.provider) {
    changes.push({ field: "Provider", before: previous.provider, after: next.provider });
  }
  for (const key of Object.keys(next.features)) {
    const before = previous.features[key];
    const after = next.features[key];
    if (before !== after) {
      changes.push({
        field: `Feature: ${key}`,
        before: before ? "enabled" : "disabled",
        after: after ? "enabled" : "disabled",
      });
    }
  }
  return changes;
}

function buildEnvRequirements(config) {
  const keys = [];
  const providerKeys = PROVIDER_ENV_KEYS[config.provider] ?? [];
  for (const key of providerKeys) {
    keys.push({ key, reason: `${config.provider} provider` });
  }
  for (const [feature, enabled] of Object.entries(config.features)) {
    if (!enabled) continue;
    const featureKeys = FEATURE_ENV_KEYS[feature] ?? [];
    for (const fk of featureKeys) {
      keys.push({ key: fk, reason: `${feature} feature` });
    }
  }
  return keys;
}

function formatToggle(enabled) {
  return enabled ? "\u2611" : "\u2610";
}

export function printSetupSummary(config, previousConfig) {
  console.log("");
  console.log("\u2500 Setup Complete ".padEnd(60, "\u2500"));
  console.log("");

  console.log(` Provider: ${config.provider}`);
  console.log(" Features:");
  for (const [key, enabled] of Object.entries(config.features)) {
    console.log(`  ${formatToggle(enabled)} ${key.padEnd(22)} ${enabled ? "enabled" : "disabled"}`);
  }

  if (previousConfig) {
    const changes = computeChanges(previousConfig, config);
    if (changes.length > 0) {
      console.log("");
      console.log(" Changes from previous config:");
      for (const c of changes) {
        const arrow = "\u2192";
        console.log(`  ${c.field}: ${c.before} ${arrow} ${c.after}`);
      }
    } else {
      console.log("");
      console.log(" No changes from previous config.");
    }
  }

  console.log("");
  console.log(" \u26A0 Environment variables required:");
  const envKeys = buildEnvRequirements(config);
  if (envKeys.length === 0) {
    console.log("  (none required)");
  } else {
    for (const { key, reason } of envKeys) {
      console.log(`  ${key.padEnd(36)} required by: ${reason}`);
    }
  }

  console.log("");
  console.log(" Next steps:");
  console.log("  1. Set required env vars in your .env file or environment");
  console.log("  2. Review app.setup.json for your configuration");
  console.log("  3. Run: pnpm lint && pnpm typecheck && pnpm test");
  console.log("");
}
