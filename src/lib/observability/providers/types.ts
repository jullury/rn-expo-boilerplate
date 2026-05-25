export type AnalyticsPayloadValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type AnalyticsPayload = Record<string, AnalyticsPayloadValue>;

export type AnalyticsProvider = {
  identify: (userId: string, traits?: AnalyticsPayload) => void;
  track: (name: string, payload?: AnalyticsPayload) => void;
  screen: (name: string, payload?: AnalyticsPayload) => void;
  reset: () => void;
};

export type CrashProvider = {
  captureException: (error: Error, context?: Record<string, unknown>) => void;
  captureMessage: (message: string, context?: Record<string, unknown>) => void;
  setUser: (user: { id: string; email?: string } | null) => void;
  setTag: (key: string, value: string) => void;
};
