import { z } from "zod";

export const featureFlagsResponseSchema = z.object({
  newSignInExperience: z.boolean().optional(),
  enableOfflineBanner: z.boolean().optional(),
});

export type FeatureFlagsResponse = z.infer<typeof featureFlagsResponseSchema>;
