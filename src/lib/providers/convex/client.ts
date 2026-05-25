import { ConvexHttpClient } from "convex/browser";

let client: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!client) {
    const url =
      process.env.EXPO_PUBLIC_CONVEX_URL ??
      process.env.EXPO_PUBLIC_API_URL ??
      "";
    if (!url) {
      throw new Error(
        "Convex URL not configured. Set EXPO_PUBLIC_CONVEX_URL or EXPO_PUBLIC_API_URL.",
      );
    }
    client = new ConvexHttpClient(url);
  }
  return client;
}
