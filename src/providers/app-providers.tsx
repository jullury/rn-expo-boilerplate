import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { FeatureFlagsProvider } from "@/lib/feature-flags/provider";
import { initI18n } from "@/lib/i18n";
import type {
  AnalyticsProvider,
  CrashProvider,
} from "@/lib/observability/providers/types";
import { setObservabilityProviders } from "@/lib/observability/providers/registry";
import {
  noopAnalyticsProvider,
  noopCrashProvider,
} from "@/lib/observability/providers/noop";
import {
  createPostHogAnalyticsProvider,
  createPostHogClient,
} from "@/lib/observability/providers/posthog/provider";
import { createSentryCrashProvider } from "@/lib/observability/providers/sentry/provider";
import { bootstrapPlatformCapabilities } from "@/lib/platform/bootstrap";
import { subscribeNetworkState } from "@/lib/platform/network";
import { queryClient } from "@/lib/query/query-client";
import { setupEnvContract } from "@/lib/setup/generated/env-contract";
import { setupEnabledFeatures } from "@/lib/setup/generated/feature-flags";
import { validateRuntimeSetup } from "@/lib/setup/runtime-validation";
import { useAppStore } from "@/store/app-store";
import { useSetupStore } from "@/store/setup-store";

export function AppProviders({ children }: PropsWithChildren) {
  const setIsOnline = useAppStore((state) => state.setIsOnline);
  const setRuntimeValidation = useSetupStore(
    (state) => state.setRuntimeValidation,
  );

  useEffect(() => {
    void initI18n();
    void bootstrapPlatformCapabilities();

    const validation = validateRuntimeSetup(setupEnvContract, process.env);
    setRuntimeValidation(validation);

    if (validation.valid) {
      let crash: CrashProvider = noopCrashProvider;
      let analytics: AnalyticsProvider = noopAnalyticsProvider;

      if (
        setupEnabledFeatures.errorReporting &&
        process.env.EXPO_PUBLIC_SENTRY_DSN
      ) {
        Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });
        crash = createSentryCrashProvider();
      }

      if (
        setupEnabledFeatures.analytics &&
        process.env.EXPO_PUBLIC_POSTHOG_API_KEY
      ) {
        const posthog = createPostHogClient({
          apiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
        });
        analytics = createPostHogAnalyticsProvider(posthog as any);
      }

      setObservabilityProviders({ analytics, crash });
    }
  }, [setRuntimeValidation]);

  useEffect(() => {
    const unsubscribe = subscribeNetworkState((state) => {
      setIsOnline(
        Boolean(state.isConnected && state.isInternetReachable !== false),
      );
    });

    return unsubscribe;
  }, [setIsOnline]);

  return (
    <QueryClientProvider client={queryClient}>
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    </QueryClientProvider>
  );
}
