import type { ProviderRequestResult } from "@/lib/api/providers/types";
import { supabase } from "@/lib/providers/supabase/client";

export type SupabaseQueryOptions = {
  table: string;
  select?: string;
  eq?: [string, unknown];
  single?: boolean;
};

export async function supabaseQuery<T = unknown>(
  options: SupabaseQueryOptions,
): Promise<ProviderRequestResult<T>> {
  try {
    let query = supabase.from(options.table).select(options.select ?? "*");

    if (options.eq) {
      query = query.eq(options.eq[0], options.eq[1]);
    }

    if (options.single) {
      const { data, error } = await query.single();
      if (error) return { ok: false, error };
      return { ok: true, data: data as T };
    }

    const { data, error } = await query;
    if (error) return { ok: false, error };
    return { ok: true, data: data as T };
  } catch (error) {
    return { ok: false, error };
  }
}
