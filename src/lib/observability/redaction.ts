const SENSITIVE_KEYS = [
  "authorization",
  "token",
  "accessToken",
  "refreshToken",
  "password",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function redactPayload<T>(payload: T): T {
  if (Array.isArray(payload)) {
    return payload.map((item) => redactPayload(item)) as T;
  }

  if (!isObject(payload)) {
    return payload;
  }

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_KEYS.includes(key)) {
      output[key] = "[REDACTED]";
      continue;
    }

    output[key] = redactPayload(value);
  }

  return output as T;
}
