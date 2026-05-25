import { create, type AxiosRequestConfig } from "axios";

import { resolveApiProviderAdapter } from "@/lib/api/providers/generated/adapter-resolver";
import { incrementMetric } from "@/lib/observability/metrics";

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 300;
const CIRCUIT_FAILURE_THRESHOLD = 5;
const CIRCUIT_COOLDOWN_MS = 30_000;

type CircuitState = {
  failureCount: number;
  openedAt: number | null;
};

const circuit: CircuitState = {
  failureCount: 0,
  openedAt: null,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isCircuitOpen() {
  if (!circuit.openedAt) {
    return false;
  }

  if (Date.now() - circuit.openedAt > CIRCUIT_COOLDOWN_MS) {
    incrementMetric("api.circuit.closed");
    circuit.openedAt = null;
    circuit.failureCount = 0;
    return false;
  }

  return true;
}

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const activeApiProviderAdapter = resolveApiProviderAdapter();

apiClient.interceptors.request.use((config) => {
  if (isCircuitOpen()) {
    incrementMetric("api.circuit.rejected");
    return Promise.reject(new Error("Circuit breaker is open"));
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    incrementMetric("api.request.success");
    circuit.failureCount = 0;
    circuit.openedAt = null;
    return response;
  },
  async (error) => {
    incrementMetric("api.request.error");
    const config = error.config as
      | (AxiosRequestConfig & { __retryCount?: number })
      | undefined;
    const status = error.response?.status as number | undefined;

    const retryable = !status || RETRYABLE_STATUS.has(status);
    if (!config || !retryable) {
      circuit.failureCount += 1;
      incrementMetric("api.retry.skipped");
      if (circuit.failureCount >= CIRCUIT_FAILURE_THRESHOLD) {
        incrementMetric("api.circuit.opened");
        circuit.openedAt = Date.now();
      }
      return Promise.reject(error);
    }

    const retryCount = config.__retryCount ?? 0;
    if (retryCount >= MAX_RETRIES) {
      circuit.failureCount += 1;
      incrementMetric("api.retry.maxed");
      if (circuit.failureCount >= CIRCUIT_FAILURE_THRESHOLD) {
        incrementMetric("api.circuit.opened");
        circuit.openedAt = Date.now();
      }
      return Promise.reject(error);
    }

    config.__retryCount = retryCount + 1;
    incrementMetric("api.retry.attempt");
    const backoffDelay = BASE_RETRY_DELAY_MS * 2 ** retryCount;
    await sleep(backoffDelay);
    return apiClient(config);
  },
);
