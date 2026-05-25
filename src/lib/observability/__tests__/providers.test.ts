import { getObservabilityProviders } from "@/lib/observability/providers/registry";

describe("getObservabilityProviders", () => {
  it("falls back to noop providers when runtime setup is invalid", () => {
    const providers = getObservabilityProviders({ valid: false });
    expect((providers.analytics as { name?: string }).name).toBe("noop");
    expect((providers.crash as { name?: string }).name).toBe("noop");
  });
});
