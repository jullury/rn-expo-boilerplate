import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const PROVIDERS = ["supabase", "convex", "firebase", "custom"];

function parseBoolean(inputValue, defaultValue) {
  const normalized = inputValue.trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (["y", "yes", "true", "1"].includes(normalized)) return true;
  if (["n", "no", "false", "0"].includes(normalized)) return false;
  return defaultValue;
}

export async function selectProvider(defaultProvider) {
  if (!process.stdin.isTTY) {
    return defaultProvider;
  }

  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(
      `API provider (${PROVIDERS.join("/")}) [${defaultProvider}]: `,
    );
    const value = answer.trim().toLowerCase();
    if (!value) return defaultProvider;
    if (PROVIDERS.includes(value)) return value;
    return defaultProvider;
  } finally {
    rl.close();
  }
}

export async function selectFeatures(defaultFeatures) {
  if (!process.stdin.isTTY) {
    return defaultFeatures;
  }

  const rl = createInterface({ input, output });
  try {
    const keys = Object.keys(defaultFeatures);
    const result = { ...defaultFeatures };
    for (const key of keys) {
      const answer = await rl.question(
        `Enable ${key}? [${defaultFeatures[key] ? "Y/n" : "y/N"}]: `,
      );
      result[key] = parseBoolean(answer, defaultFeatures[key]);
    }
    return result;
  } finally {
    rl.close();
  }
}
