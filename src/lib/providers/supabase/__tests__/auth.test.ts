import type { AuthProvider } from "@/lib/auth/types";
import { AuthError } from "@/lib/auth/errors";
import { supabase } from "@/lib/providers/supabase/client";
import { supabaseAuthProvider } from "@/lib/providers/supabase/auth";

// Mock the supabase client module to prevent expo Babel transform issues
// NOTE: Jest hoists jest.mock() to execute before imports, even though it appears here syntactically
jest.mock("@/lib/providers/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockAuth = supabase.auth as unknown as {
  signInWithPassword: jest.Mock;
  signOut: jest.Mock;
  refreshSession: jest.Mock;
  getSession: jest.Mock;
};

describe("supabaseAuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = supabaseAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });

  it("signIn returns AuthSession on success", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: {
        session: {
          access_token: "at-1",
          refresh_token: "rt-1",
          user: { id: "u1", email: "test@example.com" },
        },
      },
      error: null,
    });

    const session = await supabaseAuthProvider.signIn({
      email: "test@example.com",
      password: "password123",
    });

    expect(session.accessToken).toBe("at-1");
    expect(session.refreshToken).toBe("rt-1");
    expect(session.user.id).toBe("u1");
    expect(session.user.email).toBe("test@example.com");
  });

  it("signIn throws AuthError on failure", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    await expect(
      supabaseAuthProvider.signIn({ email: "bad", password: "wrong" }),
    ).rejects.toThrow(AuthError);
  });

  it("signOut calls supabase.auth.signOut", async () => {
    mockAuth.signOut.mockResolvedValueOnce({ error: null });
    await supabaseAuthProvider.signOut();
    expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
  });

  it("restoreSession returns signed_out when no session", async () => {
    mockAuth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    const result = await supabaseAuthProvider.restoreSession();
    expect(result.status).toBe("signed_out");
  });

  it("restoreSession returns authenticated when session exists", async () => {
    mockAuth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          access_token: "at-1",
          refresh_token: "rt-1",
          user: { id: "u1", email: "test@example.com" },
        },
      },
    });

    const result = await supabaseAuthProvider.restoreSession();
    expect(result.status).toBe("authenticated");
    if (result.status === "authenticated") {
      expect(result.session.accessToken).toBe("at-1");
    }
  });

  it("getAccessToken returns token from session", async () => {
    mockAuth.getSession.mockResolvedValueOnce({
      data: {
        session: { access_token: "at-1" },
      },
    });

    const token = await supabaseAuthProvider.getAccessToken();
    expect(token).toBe("at-1");
  });

  it("getAccessToken returns null when no session", async () => {
    mockAuth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    const token = await supabaseAuthProvider.getAccessToken();
    expect(token).toBeNull();
  });
});
