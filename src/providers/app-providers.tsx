import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { FeatureFlagsProvider } from "@/lib/feature-flags/provider";
import { initI18n } from "@/lib/i18n";
import { bootstrapPlatformCapabilities } from "@/lib/platform/bootstrap";
import { subscribeNetworkState } from "@/lib/platform/network";
import { queryClient } from "@/lib/query/query-client";
import { setupEnvContract } from "@/lib/setup/generated/env-contract";
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
