import { mapApiError } from "@/lib/api/errors";

describe("mapApiError", () => {
  it("maps unknown errors to a stable fallback", () => {
    const error = mapApiError(new Error("boom"));

    expect(error.code).toBe("unknown_error");
    expect(error.message).toBe("boom");
  });
});
