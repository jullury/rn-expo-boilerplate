import type { SetupFeatures, SetupProvider } from "@/lib/setup/types";

type BuildEnvContractInput = {
  provider: SetupProvider;
  features: SetupFeatures;
};

const providerRequiredKeys: Record<SetupProvider, string[]> = {
  supabase: ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_ANON_KEY"],
  convex: ["EXPO_PUBLIC_CONVEX_URL"],
  firebase: [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ],
  custom: ["EXPO_PUBLIC_API_URL"],
};

const featureRequiredKeys: Partial<Record<keyof SetupFeatures, string[]>> = {
  analytics: ["EXPO_PUBLIC_FLAGS_ENDPOINT", "EXPO_PUBLIC_POSTHOG_API_KEY"],
  errorReporting: ["EXPO_PUBLIC_SENTRY_DSN"],
};

export function buildEnvContract(input: BuildEnvContractInput) {
  const requiredKeys = new Set<string>(providerRequiredKeys[input.provider]);

  for (const [feature, enabled] of Object.entries(input.features) as [
    keyof SetupFeatures,
    boolean,
  ][]) {
    if (!enabled) continue;

    for (const key of featureRequiredKeys[feature] ?? []) {
      requiredKeys.add(key);
    }
  }

  return {
    requiredKeys: Array.from(requiredKeys).sort(),
  };
}
