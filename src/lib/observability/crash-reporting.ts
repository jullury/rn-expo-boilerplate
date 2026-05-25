import { logError } from "@/lib/observability/logger";

type CrashContext = Record<string, unknown>;

export function captureError(error: Error, context?: CrashContext) {
  logError("crash.capture", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
  });
}
