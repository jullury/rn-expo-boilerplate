import type {
  AnalyticsProvider,
  CrashProvider,
} from "@/lib/observability/providers/types";

export const noopAnalyticsProvider: AnalyticsProvider & { name: "noop" } = {
  name: "noop",
  identify: () => {},
  track: () => {},
  screen: () => {},
  reset: () => {},
};

export const noopCrashProvider: CrashProvider & { name: "noop" } = {
  name: "noop",
  captureException: () => {},
  captureMessage: () => {},
  setUser: () => {},
  setTag: () => {},
};
