import {
  parseSetupConfig,
  safeParseSetupConfig,
} from "@/lib/setup/config-schema";

describe("parseSetupConfig", () => {
  it("accepts one provider and feature map", () => {
    const parsed = parseSetupConfig({
      version: 1,
      provider: "supabase",
      features: {
        auth: true,
        analytics: false,
        errorReporting: true,
        pushNotifications: false,
        payments: false,
      },
    });

    expect(parsed.provider).toBe("supabase");
    expect(parsed.features.auth).toBe(true);
  });

  it("rejects unsupported providers", () => {
    const result = safeParseSetupConfig({
      version: 1,
      provider: "rest",
      features: {
        auth: true,
        analytics: false,
        errorReporting: true,
        pushNotifications: false,
        payments: false,
      },
    });

    expect(result.success).toBe(false);
  });
});
