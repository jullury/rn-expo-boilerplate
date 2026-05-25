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

describe("createAuthProvider", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it("restores session from secure storage", async () => {
    mockStorage.set("auth.accessToken", "access-1");
    mockStorage.set("auth.refreshToken", "refresh-1");
    mockStorage.set(
      "auth.user",
      JSON.stringify({ id: "user-1", email: "a@b.com" }),
    );

    const provider = createAuthProvider({
      apiClient: {
        signIn: jest.fn(),
        refreshSession: jest.fn(),
      },
    });

    const result = await provider.restoreSession();
    expect(result.status).toBe("authenticated");
  });

  it("coalesces in-flight refresh requests", async () => {
    mockStorage.set("auth.refreshToken", "refresh-1");

    const refreshSession = jest.fn(async () => ({
      accessToken: "access-2",
      refreshToken: "refresh-2",
      user: { id: "user-1" },
    }));

    const provider = createAuthProvider({
      apiClient: {
        signIn: jest.fn(),
        refreshSession,
      },
    });

    await Promise.all([provider.refreshSession(), provider.refreshSession()]);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });
});
