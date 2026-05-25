import type { AnalyticsProvider } from "@/lib/observability/providers/types";
import { createPostHogAnalyticsProvider } from "@/lib/observability/providers/posthog/provider";

jest.mock("posthog-react-native", () => ({
  PostHog: jest.fn(),
}));

describe("PostHogAnalyticsProvider", () => {
  it("conforms to AnalyticsProvider contract", () => {
    const provider: AnalyticsProvider = createPostHogAnalyticsProvider({
      identify: jest.fn(),
      capture: jest.fn(),
      screen: jest.fn(),
      reset: jest.fn(),
    } as any);
    expect(typeof provider.identify).toBe("function");
    expect(typeof provider.track).toBe("function");
    expect(typeof provider.screen).toBe("function");
    expect(typeof provider.reset).toBe("function");
  });
});
