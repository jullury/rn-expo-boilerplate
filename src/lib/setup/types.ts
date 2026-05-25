export const setupProviders = [
  "supabase",
  "convex",
  "firebase",
  "custom",
] as const;

export type SetupProvider = (typeof setupProviders)[number];

export type SetupFeatures = {
  auth: boolean;
  analytics: boolean;
  errorReporting: boolean;
  pushNotifications: boolean;
  payments: boolean;
};

export type SetupConfig = {
  version: 1;
  provider: SetupProvider;
  features: SetupFeatures;
};

export type SetupEnvContract = {
  requiredKeys: string[];
};
