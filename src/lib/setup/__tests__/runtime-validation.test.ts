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
  });
});
