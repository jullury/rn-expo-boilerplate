import { PostHog } from "posthog-react-native";

import type {
  AnalyticsPayload,
  AnalyticsProvider,
} from "@/lib/observability/providers/types";

type PostHogLike = {
  identify: (userId?: string, properties?: unknown, options?: unknown) => void;
  capture: (event: string, properties?: unknown, options?: unknown) => void;
  screen: (screenName: string, properties?: unknown) => void;
  reset: () => void;
};

export function createPostHogAnalyticsProvider(
  client: PostHogLike,
): AnalyticsProvider {
  return {
    identify(userId, traits) {
      client.identify(userId, normalizePayload(traits));
    },
    track(name, payload) {
      client.capture(name, normalizePayload(payload));
    },
    screen(name, payload) {
      client.screen(name, normalizePayload(payload));
    },
    reset() {
      client.reset();
    },
  };
}

export function createPostHogClient(config: { apiKey: string; host?: string }) {
  return new PostHog(config.apiKey, {
    host: config.host,
  });
}

function normalizePayload(
  payload?: AnalyticsPayload,
): Record<string, unknown> | undefined {
  if (!payload) {
    return undefined;
  }
  return payload;
}
