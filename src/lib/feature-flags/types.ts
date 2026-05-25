export type FeatureFlags = {
  newSignInExperience: boolean;
  enableOfflineBanner: boolean;
};

export const defaultFeatureFlags: FeatureFlags = {
  newSignInExperience: false,
  enableOfflineBanner: true,
};
