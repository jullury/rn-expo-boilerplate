import { z } from "zod";

import { setupProviders, type SetupConfig } from "@/lib/setup/types";

const setupFeaturesSchema = z.object({
  auth: z.boolean(),
  analytics: z.boolean(),
  errorReporting: z.boolean(),
  pushNotifications: z.boolean(),
  payments: z.boolean(),
});

const setupConfigSchema = z.object({
  version: z.literal(1),
  provider: z.enum(setupProviders),
  features: setupFeaturesSchema,
});

export function parseSetupConfig(input: unknown): SetupConfig {
  return setupConfigSchema.parse(input);
}

export function safeParseSetupConfig(input: unknown) {
  return setupConfigSchema.safeParse(input);
}
