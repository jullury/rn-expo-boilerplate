import { logInfo } from "@/lib/observability/logger";
import { getObservabilityProviders } from "@/lib/observability/providers/registry";
import type { AnalyticsPayload } from "@/lib/observability/providers/types";

const runtimeState = { valid: true };

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  const { analytics } = getObservabilityProviders(runtimeState);
  analytics.track(name, payload);

  logInfo("analytics.event", {
    name,
    payload,
  });
}

export function trackScreen(name: string, payload?: AnalyticsPayload) {
  const { analytics } = getObservabilityProviders(runtimeState);
  analytics.screen(name, payload);

  logInfo("analytics.screen", {
    name,
    payload,
  });
}
