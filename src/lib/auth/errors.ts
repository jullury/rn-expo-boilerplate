export type AuthErrorCode =
  | "invalid_credentials"
  | "session_expired"
  | "network_unavailable"
  | "provider_unconfigured";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
