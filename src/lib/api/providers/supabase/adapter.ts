import { apiClient } from "@/lib/api/client";
import type { ApiProviderAdapter } from "@/lib/api/providers/types";

export const supabaseAdapter: ApiProviderAdapter = {
  id: "supabase",
  async request(config) {
    try {
      const response = await apiClient.request(config);
      return { ok: true, data: response.data };
    } catch (error) {
      return { ok: false, error };
    }
  },
};
