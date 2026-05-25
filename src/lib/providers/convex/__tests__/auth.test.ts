import type { AuthProvider } from "@/lib/auth/types";
import { AuthError } from "@/lib/auth/errors";
import { convexAuthProvider } from "@/lib/providers/convex/auth";

// Mock getConvexClient to return a mock ConvexHttpClient
const mockMutation = jest.fn();

jest.mock("@/lib/providers/convex/client", () => ({
  getConvexClient: jest.fn(() => ({
    mutation: mockMutation,
    query: jest.fn(),
    action: jest.fn(),
    setAuth: jest.fn(),
    clearAuth: jest.fn(),
  })),
}));

beforeEach(() => {
  mockMutation.mockReset();
});

describe("convexAuthProvider", () => {
  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = convexAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });

  it("signIn calls auth:signIn mutation and returns AuthSession", async () => {
    mockMutation.mockResolvedValueOnce({
      token: "cvx-token-1",
      user: { id: "cvx-u1", email: "test@example.com" },
    });

    const session = await convexAuthProvider.signIn({
      email: "test@example.com",
      password: "password123",
    });

    expect(mockMutation).toHaveBeenCalledWith("auth:signIn", {
      email: "test@example.com",
      password: "password123",
    });
    expect(session.accessToken).toBe("cvx-token-1");
    expect(session.user.id).toBe("cvx-u1");
    expect(session.user.email).toBe("test@example.com");
  });

  it("signIn throws AuthError when mutation returns no token", async () => {
    mockMutation.mockResolvedValueOnce({});

    await expect(
      convexAuthProvider.signIn({ email: "bad", password: "wrong" }),
    ).rejects.toThrow(AuthError);
  });

  it("signIn throws AuthError when mutation fails", async () => {
    mockMutation.mockRejectedValueOnce(new Error("Invalid login credentials"));

    await expect(
      convexAuthProvider.signIn({ email: "bad", password: "wrong" }),
    ).rejects.toThrow(AuthError);
  });

  it("signOut resolves without throwing", async () => {
    await expect(convexAuthProvider.signOut()).resolves.toBeUndefined();
  });

  it("refreshSession throws session_expired", async () => {
    await expect(convexAuthProvider.refreshSession()).rejects.toThrow(
      AuthError,
    );
  });

  it("restoreSession returns signed_out", async () => {
    const result = await convexAuthProvider.restoreSession();
    expect(result.status).toBe("signed_out");
  });

  it("getAccessToken returns null", async () => {
    const token = await convexAuthProvider.getAccessToken();
    expect(token).toBeNull();
  });
});
