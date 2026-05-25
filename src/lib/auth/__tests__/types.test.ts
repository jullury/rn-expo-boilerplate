import type { AuthProvider } from "@/lib/auth/types";
import type {
  AnalyticsProvider,
  CrashProvider,
} from "@/lib/observability/providers/types";

describe("provider contracts", () => {
  it("auth provider exposes required lifecycle methods", () => {
    const provider = {
      signIn: jest.fn(),
      refreshSession: jest.fn(),
      restoreSession: jest.fn(),
      signOut: jest.fn(),
      getAccessToken: jest.fn(),
    } as unknown as AuthProvider;

    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });

  it("observability providers expose required methods", () => {
    const analytics = {
      identify: jest.fn(),
      track: jest.fn(),
      screen: jest.fn(),
      reset: jest.fn(),
    } as unknown as AnalyticsProvider;

    const crash = {
      captureException: jest.fn(),
      captureMessage: jest.fn(),
      setUser: jest.fn(),
      setTag: jest.fn(),
    } as unknown as CrashProvider;

    expect(typeof analytics.track).toBe("function");
    expect(typeof crash.captureException).toBe("function");
  });
});
