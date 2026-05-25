import { createAuthProvider } from "@/lib/auth/provider";

const mockStorage = new Map<string, string>();

jest.mock("@/lib/storage/secure", () => ({
  getSecureItem: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
  setSecureItem: jest.fn(async (key: string, value: string) => {
    mockStorage.set(key, value);
  }),
  deleteSecureItem: jest.fn(async (key: string) => {
    mockStorage.delete(key);
  }),
}));

const mockTrackEvent = jest.fn();

jest.mock("@/lib/observability/analytics", () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

describe("auth observability events", () => {
  beforeEach(() => {
    mockStorage.clear();
    mockTrackEvent.mockClear();
  });

  it("emits sign_in_success and token_refresh_success events", async () => {
    const provider = createAuthProvider({
      apiClient: {
        signIn: jest.fn(async () => ({
          accessToken: "access-1",
          refreshToken: "refresh-1",
          user: { id: "user-1" },
        })),
        refreshSession: jest.fn(async () => ({
          accessToken: "access-2",
          refreshToken: "refresh-2",
          user: { id: "user-1" },
        })),
      },
    });

    await provider.signIn({ email: "a@b.com", password: "pw" });
    await provider.refreshSession();

    expect(mockTrackEvent).toHaveBeenCalledWith(
      "auth.sign_in_success",
      expect.any(Object),
    );
    expect(mockTrackEvent).toHaveBeenCalledWith(
      "auth.token_refresh_success",
      expect.any(Object),
    );
  });
});
