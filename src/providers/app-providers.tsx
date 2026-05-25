import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { initI18n } from "@/lib/i18n";
import { queryClient } from "@/lib/query/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    void initI18n();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
