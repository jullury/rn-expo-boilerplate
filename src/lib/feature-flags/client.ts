import { apiClient } from "@/lib/api/client";
import {
  defaultFeatureFlags,
  type FeatureFlags,
} from "@/lib/feature-flags/types";

export async function fetchRemoteFeatureFlags(): Promise<FeatureFlags> {
  const endpoint = process.env.EXPO_PUBLIC_FLAGS_ENDPOINT;
  if (!endpoint) {
    return defaultFeatureFlags;
  }

  const response = await apiClient.get<Partial<FeatureFlags>>(endpoint);

  return {
    ...defaultFeatureFlags,
    ...response.data,
  };
}
