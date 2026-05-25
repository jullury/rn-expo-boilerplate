import {
  noopAnalyticsProvider,
  noopCrashProvider,
} from "@/lib/observability/providers/noop";
import type {
  AnalyticsProvider,
  CrashProvider,
} from "@/lib/observability/providers/types";

type RuntimeSetupState = {
  valid: boolean;
};

let analyticsProvider: AnalyticsProvider = noopAnalyticsProvider;
let crashProvider: CrashProvider = noopCrashProvider;

export function getObservabilityProviders(input: RuntimeSetupState) {
  if (!input.valid) {
    return {
      analytics: noopAnalyticsProvider,
      crash: noopCrashProvider,
    };
  }

  return {
    analytics: analyticsProvider,
    crash: crashProvider,
  };
}

export function setObservabilityProviders(input: {
  analytics: AnalyticsProvider;
  crash: CrashProvider;
}) {
  analyticsProvider = input.analytics;
  crashProvider = input.crash;
}
