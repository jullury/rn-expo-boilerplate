import type { AxiosRequestConfig } from "axios";

export type ProviderRequestResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: unknown;
};

export type ApiProviderAdapter = {
  id: "supabase" | "convex" | "firebase" | "custom";
  request: <T = unknown>(
    config: AxiosRequestConfig,
  ) => Promise<ProviderRequestResult<T>>;
};
