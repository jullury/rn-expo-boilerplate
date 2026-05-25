import * as Sentry from "@sentry/react-native";

import type { CrashProvider } from "@/lib/observability/providers/types";

export function createSentryCrashProvider(): CrashProvider {
  return {
    captureException(error, context) {
      Sentry.captureException(error, { extra: context });
    },
    captureMessage(message, context) {
      Sentry.captureMessage(message, { extra: context });
    },
    setUser(user) {
      if (!user) {
        Sentry.setUser(null);
        return;
      }
      Sentry.setUser({ id: user.id, email: user.email });
    },
    setTag(key, value) {
      Sentry.setTag(key, value);
    },
  };
}
