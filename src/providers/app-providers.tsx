import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { initI18n } from "@/lib/i18n";
import { bootstrapPlatformCapabilities } from "@/lib/platform/bootstrap";
import { subscribeNetworkState } from "@/lib/platform/network";
import { queryClient } from "@/lib/query/query-client";
import { useAppStore } from "@/store/app-store";

export function AppProviders({ children }: PropsWithChildren) {
  const setIsOnline = useAppStore((state) => state.setIsOnline);

  useEffect(() => {
    void initI18n();
    void bootstrapPlatformCapabilities();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeNetworkState((state) => {
      setIsOnline(
        Boolean(state.isConnected && state.isInternetReachable !== false),
      );
    });

    return unsubscribe;
  }, [setIsOnline]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
