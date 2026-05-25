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

    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_SUPABASE_URL");
    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_SUPABASE_ANON_KEY");
    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_FLAGS_ENDPOINT");
  });

  it("includes convex-specific env keys", () => {
    const contract = buildEnvContract({
      provider: "convex",
      features: {
        auth: true,
        analytics: false,
        errorReporting: false,
        pushNotifications: false,
        payments: false,
      },
    });

    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_CONVEX_URL");
  });

  it("includes firebase-specific env keys", () => {
    const contract = buildEnvContract({
      provider: "firebase",
      features: {
        auth: true,
        analytics: false,
        errorReporting: false,
        pushNotifications: false,
        payments: false,
      },
    });

    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_FIREBASE_API_KEY");
    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_FIREBASE_PROJECT_ID");
    expect(contract.requiredKeys).toContain("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN");
  });
});
