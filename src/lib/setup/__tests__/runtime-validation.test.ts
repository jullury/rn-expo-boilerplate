import { validateRuntimeSetup } from "@/lib/setup/runtime-validation";

describe("validateRuntimeSetup", () => {
  it("returns invalid and missing keys when required env values are absent", () => {
    const result = validateRuntimeSetup(
      {
        requiredKeys: ["EXPO_PUBLIC_API_URL"],
      },
      {},
    );

    expect(result.valid).toBe(false);
    expect(result.missingKeys).toContain("EXPO_PUBLIC_API_URL");
    expect(result.warnings).toEqual([]);
  });

  it("includes warnings when running in production with missing keys", () => {
    const result = validateRuntimeSetup(
      {
        requiredKeys: ["EXPO_PUBLIC_API_URL"],
      },
      {
        EXPO_PUBLIC_APP_ENV: "production",
      },
    );

    expect(result.valid).toBe(false);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain("Production");
  });
});
