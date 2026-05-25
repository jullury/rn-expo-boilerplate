import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
} from "@/lib/storage/secure";

import { AuthError } from "@/lib/auth/errors";
import type {
  AuthProvider,
  AuthRestoreResult,
  AuthSession,
  SignInInput,
} from "@/lib/auth/types";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const USER_KEY = "auth.user";

type AuthApiClient = {
  signIn: (input: SignInInput) => Promise<AuthSession>;
  refreshSession: (refreshToken: string) => Promise<AuthSession>;
  revokeSession?: (refreshToken: string) => Promise<void>;
};

type AuthProviderDeps = {
  apiClient: AuthApiClient;
};

export function createAuthProvider({
  apiClient,
}: AuthProviderDeps): AuthProvider {
  let inFlightRefresh: Promise<AuthSession> | null = null;

  async function persistSession(session: AuthSession) {
    await Promise.all([
      setSecureItem(ACCESS_TOKEN_KEY, session.accessToken),
      setSecureItem(REFRESH_TOKEN_KEY, session.refreshToken),
      setSecureItem(USER_KEY, JSON.stringify(session.user)),
    ]);
  }

  async function clearSession() {
    await Promise.all([
      deleteSecureItem(ACCESS_TOKEN_KEY),
      deleteSecureItem(REFRESH_TOKEN_KEY),
      deleteSecureItem(USER_KEY),
    ]);
  }

  return {
    async signIn(input) {
      const session = await apiClient.signIn(input);
      await persistSession(session);
      return session;
    },

    async signOut() {
      const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
      if (refreshToken && apiClient.revokeSession) {
        await apiClient.revokeSession(refreshToken);
      }
      await clearSession();
    },

    async refreshSession() {
      if (inFlightRefresh) {
        return inFlightRefresh;
      }

      inFlightRefresh = (async () => {
        const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new AuthError("session_expired", "Missing refresh token");
        }

        const session = await apiClient.refreshSession(refreshToken);
        await persistSession(session);
        return session;
      })();

      try {
        return await inFlightRefresh;
      } finally {
        inFlightRefresh = null;
      }
    },

    async restoreSession(): Promise<AuthRestoreResult> {
      const [accessToken, refreshToken, rawUser] = await Promise.all([
        getSecureItem(ACCESS_TOKEN_KEY),
        getSecureItem(REFRESH_TOKEN_KEY),
        getSecureItem(USER_KEY),
      ]);

      if (!accessToken || !refreshToken || !rawUser) {
        return { status: "signed_out" };
      }

      const user = JSON.parse(rawUser) as AuthSession["user"];
      return {
        status: "authenticated",
        session: {
          accessToken,
          refreshToken,
          user,
        },
      };
    },

    async getAccessToken() {
      return getSecureItem(ACCESS_TOKEN_KEY);
    },
  };
}
