import type {
  AuthProvider,
  AuthRestoreResult,
  AuthSession,
  SignInInput,
} from "@/lib/auth/types";
import { AuthError } from "@/lib/auth/errors";
import { supabase } from "@/lib/providers/supabase/client";

function mapAuthSession(session: {
  access_token: string;
  refresh_token: string;
  user: { id: string; email?: string | null };
}): AuthSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: { id: session.user.id, email: session.user.email ?? undefined },
  };
}

export const supabaseAuthProvider: AuthProvider = {
  async signIn(input: SignInInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.session) {
      throw new AuthError(
        "invalid_credentials",
        error?.message ?? "Sign in failed",
      );
    }

    return mapAuthSession(data.session);
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError(
        "provider_unconfigured",
        error.message ?? "Sign out failed",
      );
    }
  },

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      throw new AuthError(
        "session_expired",
        error?.message ?? "Session refresh failed",
      );
    }

    return mapAuthSession(data.session);
  },

  async restoreSession(): Promise<AuthRestoreResult> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { status: "signed_out" };
    }

    return {
      status: "authenticated",
      session: mapAuthSession(session),
    };
  },

  async getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },
};
