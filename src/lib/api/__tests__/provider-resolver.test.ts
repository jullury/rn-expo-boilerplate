import { resolveApiProviderAdapter } from "@/lib/api/providers/generated/adapter-resolver";

jest.mock("@/lib/api/providers/supabase/adapter", () => ({
  supabaseAdapter: { id: "supabase", request: jest.fn() },
}));

jest.mock("@/lib/api/providers/convex/adapter", () => ({
  convexAdapter: { id: "convex", request: jest.fn() },
}));

jest.mock("@/lib/api/providers/firebase/adapter", () => ({
  firebaseAdapter: { id: "firebase", request: jest.fn() },
}));

describe("resolveApiProviderAdapter", () => {
  it("uses selected provider from generated resolver", () => {
    const adapter = resolveApiProviderAdapter();
    expect(adapter.id).toBe("supabase");
  });
});
