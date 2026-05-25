import { AuthError, type AuthErrorCode } from "@/lib/auth/errors";
import type { AuthProvider, AuthSession, SignInInput } from "@/lib/auth/types";
import { getConvexClient } from "@/lib/providers/convex/client";

function toAuthErrorCode(message: string): AuthErrorCode {
  if (message.includes("credentials") || message.includes("password")) {
    return "invalid_credentials";
  }
  if (message.includes("expired") || message.includes("token")) {
    return "session_expired";
  }
  if (message.includes("network") || message.includes("offline")) {
    return "network_unavailable";
  }
  return "invalid_credentials";
}

export const convexAuthProvider: AuthProvider = {
  async signIn(params: SignInInput): Promise<AuthSession> {
    const client = getConvexClient();
    try {
      const result = await client.mutation("auth:signIn" as any, {
        email: params.email,
        password: params.password,
      });

      const data = result as {
        token?: string;
        user?: { id: string; email: string };
      };

      if (!data.token || !data.user) {
        throw new AuthError("invalid_credentials", "Invalid login credentials");
      }

      return {
        accessToken: data.token,
        refreshToken: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      throw new AuthError(toAuthErrorCode(message), message);
    }
  },

  async signOut(): Promise<void> {
    // Convex auth sign-out is typically handled via the backend
    // Client-side: clear any stored tokens
  },

  async refreshSession(): Promise<AuthSession> {
    throw new AuthError("session_expired", "Session refresh not available");
  },

  async restoreSession(): Promise<
    { status: "signed_out" } | { status: "authenticated"; session: AuthSession }
  > {
    // Convex token persistence is handled by the Convex client/react context.
    // For non-React usage, no session is available at rest.
    return { status: "signed_out" };
  },

  async getAccessToken(): Promise<string | null> {
    // In a React context, useConvexAuth().fetchAccessToken would be used.
    // For non-React usage, tokens are managed by the Convex client internally.
    return null;
  },
};
