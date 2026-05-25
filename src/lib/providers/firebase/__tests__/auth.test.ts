import type { AuthProvider } from "@/lib/auth/types";
import { AuthError } from "@/lib/auth/errors";
import { firebaseAuthProvider } from "@/lib/providers/firebase/auth";
import { getFirebaseAuth } from "@/lib/providers/firebase/client";

const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockGetIdToken = jest.fn();

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

jest.mock("@/lib/providers/firebase/client", () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: {
      uid: "fb-u1",
      email: "test@example.com",
      getIdToken: (...args: unknown[]) => mockGetIdToken(...args),
    },
  })),
  getFirestoreDb: jest.fn(() => ({})),
}));

describe("firebaseAuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("conforms to AuthProvider contract", () => {
    const provider: AuthProvider = firebaseAuthProvider;
    expect(typeof provider.signIn).toBe("function");
    expect(typeof provider.signOut).toBe("function");
    expect(typeof provider.refreshSession).toBe("function");
    expect(typeof provider.restoreSession).toBe("function");
    expect(typeof provider.getAccessToken).toBe("function");
  });

  it("signIn returns AuthSession on success", async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        uid: "fb-u1",
        email: "test@example.com",
        getIdToken: jest.fn().mockResolvedValue("fb-token-1"),
      },
    });

    const session = await firebaseAuthProvider.signIn({
      email: "test@example.com",
      password: "password123",
    });

    expect(session.accessToken).toBe("fb-token-1");
    expect(session.user.id).toBe("fb-u1");
    expect(session.user.email).toBe("test@example.com");
  });

  it("signIn throws AuthError on failure", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Invalid login credentials"),
    );

    await expect(
      firebaseAuthProvider.signIn({ email: "bad", password: "wrong" }),
    ).rejects.toThrow(AuthError);
  });

  it("signOut calls firebase signOut", async () => {
    mockSignOut.mockResolvedValueOnce(undefined);
    await firebaseAuthProvider.signOut();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("getAccessToken returns null when no user", async () => {
    (getFirebaseAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    const token = await firebaseAuthProvider.getAccessToken();
    expect(token).toBeNull();
  });

  it("restoreSession returns signed_out when no user", async () => {
    (getFirebaseAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    const result = await firebaseAuthProvider.restoreSession();
    expect(result.status).toBe("signed_out");
  });
});
