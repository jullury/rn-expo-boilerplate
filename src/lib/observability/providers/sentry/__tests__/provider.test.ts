import type { CrashProvider } from "@/lib/observability/providers/types";
import { createSentryCrashProvider } from "@/lib/observability/providers/sentry/provider";

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
}));

describe("SentryCrashProvider", () => {
  it("conforms to CrashProvider contract", () => {
    const provider: CrashProvider = createSentryCrashProvider();
    expect(typeof provider.captureException).toBe("function");
    expect(typeof provider.captureMessage).toBe("function");
    expect(typeof provider.setUser).toBe("function");
    expect(typeof provider.setTag).toBe("function");
  });
});
