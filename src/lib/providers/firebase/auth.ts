import { AuthError, type AuthErrorCode } from "@/lib/auth/errors";
import type { AuthProvider, AuthSession, SignInInput } from "@/lib/auth/types";
import { getFirebaseAuth } from "@/lib/providers/firebase/client";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

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

function toSession(data: {
  uid: string;
  email: string | null;
  idToken: string;
}): AuthSession {
  return {
    accessToken: data.idToken,
    refreshToken: data.idToken,
    user: {
      id: data.uid,
      email: data.email ?? undefined,
    },
  };
}

export const firebaseAuthProvider: AuthProvider = {
  async signIn(input: SignInInput): Promise<AuthSession> {
    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password,
      );
      const idToken = await credential.user.getIdToken();
      return toSession({
        uid: credential.user.uid,
        email: credential.user.email,
        idToken,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      throw new AuthError(toAuthErrorCode(message), message);
    }
  },

  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  },

  async refreshSession(): Promise<AuthSession> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new AuthError("session_expired", "No active session");
    }
    const idToken = await user.getIdToken(true);
    return toSession({ uid: user.uid, email: user.email, idToken });
  },

  async restoreSession() {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      return { status: "signed_out" as const };
    }
    const idToken = await user.getIdToken();
    return {
      status: "authenticated" as const,
      session: toSession({ uid: user.uid, email: user.email, idToken }),
    };
  },

  async getAccessToken(): Promise<string | null> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    return user.getIdToken();
  },
};
