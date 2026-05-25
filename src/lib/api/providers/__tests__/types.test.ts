import type { ApiProviderAdapter } from "@/lib/api/providers/types";

describe("ApiProviderAdapter", () => {
  it("provider adapters satisfy contract", async () => {
    const adapter: ApiProviderAdapter = {
      id: "supabase",
      request: async () => ({ ok: true }),
    };

    const result = await adapter.request({ url: "/health" });

    expect(adapter.id).toBe("supabase");
    expect(result.ok).toBe(true);
  });
});
