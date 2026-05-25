import { apiClient } from "@/lib/api/client";

jest.mock("expo/virtual/env", () => ({
  env: process.env,
}));

describe("API security headers", () => {
  it("includes X-Content-Type-Options: nosniff", () => {
    const headers = apiClient.defaults.headers.common as Record<string, string>;
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("includes X-Frame-Options: DENY", () => {
    const headers = apiClient.defaults.headers.common as Record<string, string>;
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });

  it("includes Referrer-Policy header", () => {
    const headers = apiClient.defaults.headers.common as Record<string, string>;
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });
});
