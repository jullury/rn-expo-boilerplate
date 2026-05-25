import { apiClient } from "@/lib/api/client";
import { featureFlagsResponseSchema } from "@/lib/feature-flags/contract";
import {
  defaultFeatureFlags,
  type FeatureFlags,
} from "@/lib/feature-flags/types";
import { logWarn } from "@/lib/observability/logger";

export async function fetchRemoteFeatureFlags(): Promise<FeatureFlags> {
  const endpoint = process.env.EXPO_PUBLIC_FLAGS_ENDPOINT;
  if (!endpoint) {
    return defaultFeatureFlags;
  }

  const response = await apiClient.get<unknown>(endpoint);
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
