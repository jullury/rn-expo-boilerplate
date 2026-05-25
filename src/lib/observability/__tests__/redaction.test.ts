import { redactPayload } from "@/lib/observability/redaction";

describe("redactPayload", () => {
  it("redacts auth tokens and sensitive headers", () => {
    const result = redactPayload({
      authorization: "Bearer abc",
      token: "abc",
      nested: { refreshToken: "def" },
    });

    expect((result as Record<string, unknown>).authorization).toBe(
      "[REDACTED]",
    );
    expect((result as Record<string, unknown>).token).toBe("[REDACTED]");
    expect(
      ((result as Record<string, unknown>).nested as Record<string, unknown>)
        .refreshToken,
    ).toBe("[REDACTED]");
  });
});
