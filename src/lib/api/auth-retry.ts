import type { AxiosRequestConfig } from "axios";

import { getRuntimeAuthProvider } from "@/lib/auth/runtime-provider";

export async function handle401Retry(error: {
  config?: AxiosRequestConfig & { __authRetried?: boolean };
}) {
  const config = error.config;
  if (!config || config.__authRetried) {
    return null;
  }

  const authProvider = getRuntimeAuthProvider();
  await authProvider.refreshSession();
  config.__authRetried = true;
  return config;
}
