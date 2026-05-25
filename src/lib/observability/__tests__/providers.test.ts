import {
  getObservabilityProviders,
  setObservabilityProviders,
} from "@/lib/observability/providers/registry";
import {
  noopAnalyticsProvider,
  noopCrashProvider,
} from "@/lib/observability/providers/noop";

const testAnalyticsProvider = {
  identify: jest.fn(),
  track: jest.fn(),
  screen: jest.fn(),
  reset: jest.fn(),
};

const testCrashProvider = {
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
};

describe("getObservabilityProviders", () => {
  beforeEach(() => {
    setObservabilityProviders({
      analytics: noopAnalyticsProvider,
      crash: noopCrashProvider,
    });
  });

  it("falls back to noop providers when runtime setup is invalid", () => {
    const providers = getObservabilityProviders({ valid: false });
    expect((providers.analytics as { name?: string }).name).toBe("noop");
    expect((providers.crash as { name?: string }).name).toBe("noop");
  });

  it("returns configured providers when runtime setup is valid", () => {
    setObservabilityProviders({
      analytics: testAnalyticsProvider,
      crash: testCrashProvider,
    });

    const providers = getObservabilityProviders({ valid: true });

    expect(providers.analytics).toBe(testAnalyticsProvider);
    expect(providers.crash).toBe(testCrashProvider);
  });

  it("still returns noop providers when invalid, even if custom providers are set", () => {
    setObservabilityProviders({
      analytics: testAnalyticsProvider,
      crash: testCrashProvider,
    });

    const providers = getObservabilityProviders({ valid: false });

    expect((providers.analytics as { name?: string }).name).toBe("noop");
    expect((providers.crash as { name?: string }).name).toBe("noop");
  });
});
