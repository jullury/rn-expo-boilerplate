import { activeApiProviderAdapter } from "@/lib/api/client";
import { featureFlagsResponseSchema } from "@/lib/feature-flags/contract";
import {
  defaultFeatureFlags,
  type FeatureFlags,
} from "@/lib/feature-flags/types";
import { logWarn } from "@/lib/observability/logger";
import { setupEnabledFeatures } from "@/lib/setup/generated/feature-flags";

export async function fetchRemoteFeatureFlags(): Promise<FeatureFlags> {
  if (!setupEnabledFeatures.analytics) {
    return defaultFeatureFlags;
  }

  const endpoint = process.env.EXPO_PUBLIC_FLAGS_ENDPOINT;
  if (!endpoint) {
    return defaultFeatureFlags;
  }

  const response = await activeApiProviderAdapter.request<unknown>({
    method: "GET",
    url: endpoint,
  });

  if (!response.ok) {
    return defaultFeatureFlags;
  }

  const parsed = featureFlagsResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    logWarn("feature-flags.contract.invalid", {
      issues: parsed.error.issues.map((issue) => issue.message),
    });
    return defaultFeatureFlags;
  }

  return {
    ...defaultFeatureFlags,
    ...parsed.data,
  };
}
