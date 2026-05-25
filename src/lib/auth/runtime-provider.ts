import type { AuthProvider } from "@/lib/auth/types";

const unconfiguredAuthProvider: AuthProvider = {
  async signIn() {
    throw new Error("Auth provider is not configured");
  },
  async signOut() {
    // noop
  },
  async refreshSession() {
    throw new Error("Auth provider is not configured");
  },
  async restoreSession() {
    return { status: "signed_out" };
  },
  async getAccessToken() {
    return null;
  },
};

let runtimeAuthProvider: AuthProvider = unconfiguredAuthProvider;

export function getRuntimeAuthProvider() {
  return runtimeAuthProvider;
}

export function setRuntimeAuthProvider(provider: AuthProvider) {
  runtimeAuthProvider = provider;
}
