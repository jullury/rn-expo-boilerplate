import { handle401Retry } from "@/lib/api/auth-retry";
import { setRuntimeAuthProvider } from "@/lib/auth/runtime-provider";

describe("handle401Retry", () => {
  it("refreshes token once on 401 and marks config retried", async () => {
    const refreshSession = jest.fn(async () => ({
      accessToken: "access-2",
      refreshToken: "refresh-2",
      user: { id: "user-1" },
    }));

    setRuntimeAuthProvider({
      signIn: jest.fn(),
      signOut: jest.fn(),
      refreshSession,
      restoreSession: jest.fn(async () => ({ status: "signed_out" as const })),
      getAccessToken: jest.fn(async () => "access-1"),
    });

    const config = { url: "/profile" };
    const retriable = await handle401Retry({ config });

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(retriable?.__authRetried).toBe(true);
  });
});
