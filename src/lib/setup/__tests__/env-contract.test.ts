import { buildEnvContract } from "@/lib/setup/env-contract";

describe("buildEnvContract", () => {
  it("generates required env keys for selected provider and enabled features", () => {
    const contract = buildEnvContract({
      provider: "supabase",
      features: {
        auth: true,
        analytics: true,
        errorReporting: true,
        pushNotifications: false,
        payments: false,
      },
    });

    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_API_URL");
    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_FLAGS_ENDPOINT");
  });
});
