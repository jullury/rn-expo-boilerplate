import { create } from "zustand";

import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
} from "@/lib/storage/secure";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

type AuthState = {
  user: null | { id: string; email?: string };
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setUser: (user: AuthState["user"]) => void;
  setTokens: (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  }) => Promise<void>;
  hydrateSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setTokens: async ({ accessToken, refreshToken }) => {
    if (accessToken) {
      await setSecureItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      await deleteSecureItem(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      await deleteSecureItem(REFRESH_TOKEN_KEY);
    }

    set({ accessToken, refreshToken });
  },
  hydrateSession: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      getSecureItem(ACCESS_TOKEN_KEY),
      getSecureItem(REFRESH_TOKEN_KEY),
    ]);

    set({
      accessToken,
      refreshToken,
      isHydrated: true,
    });
  },
  signOut: async () => {
    await Promise.all([
      deleteSecureItem(ACCESS_TOKEN_KEY),
      deleteSecureItem(REFRESH_TOKEN_KEY),
    ]);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: true,
    });
  },
}));
