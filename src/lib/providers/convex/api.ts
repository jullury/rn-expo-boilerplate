import { getConvexClient } from "@/lib/providers/convex/client";

export type ConvexQueryResult<T = unknown> = {
  data: T | null;
  error: string | null;
};

export async function convexQuery<T = unknown>(
  name: string,
  args?: Record<string, unknown>,
): Promise<ConvexQueryResult<T>> {
  try {
    const client = getConvexClient();
    const result = await client.query(name as any, args as any);
    return { data: result as T, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    return { data: null, error: message };
  }
}

export async function convexMutation<T = unknown>(
  name: string,
  args?: Record<string, unknown>,
): Promise<ConvexQueryResult<T>> {
  try {
    const client = getConvexClient();
    const result = await client.mutation(name as any, args as any);
    return { data: result as T, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mutation failed";
    return { data: null, error: message };
  }
}
