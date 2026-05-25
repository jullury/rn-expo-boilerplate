import { logError } from "@/lib/observability/logger";
import { getObservabilityProviders } from "@/lib/observability/providers/registry";

type CrashContext = Record<string, unknown>;

const runtimeState = { valid: true };

export function captureError(error: Error, context?: CrashContext) {
  const { crash } = getObservabilityProviders(runtimeState);
  crash.captureException(error, context);

  logError("crash.capture", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
  });
}
