export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: number;
  user: AuthUser;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type AuthRestoreResult =
  | { status: "authenticated"; session: AuthSession }
  | { status: "signed_out" };

export type AuthProvider = {
  signIn: (input: SignInInput) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<AuthSession>;
  restoreSession: () => Promise<AuthRestoreResult>;
  getAccessToken: () => Promise<string | null>;
};
