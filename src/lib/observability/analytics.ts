import { logInfo } from "@/lib/observability/logger";

type AnalyticsPayload = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  logInfo("analytics.event", {
    name,
    payload,
  });
}

export function trackScreen(name: string, payload?: AnalyticsPayload) {
  logInfo("analytics.screen", {
    name,
    payload,
  });
}
